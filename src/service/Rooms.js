import { db } from "../config/firebase-config";
import { getRoomCode } from "../scripts/helpers";
import { getUserByUid } from "./Users";

export async function createRoom(userUid) {
  const roomCode = getRoomCode();
  await db.collection("users").doc(userUid).update({ activeRoomUid: roomCode });
  const user = await getUserByUid(userUid);
  const timeStamp = new Date().getTime();
  await db
    .collection("rooms")
    .doc(roomCode)
    .set({
      roomOwner: { ...user, uid: userUid },
      createdAt: timeStamp,
    })
    .then(() => {
      db.collection("rooms")
        .doc(roomCode)
        .collection("members")
        .doc(userUid)
        .set({ ...user, uid: userUid })
        .then(() => {
          db.collection("rooms")
            .doc(roomCode)
            .collection("games")
            .add({ createdAt: timeStamp });
        });
    })
    .catch((err) => {
      return err;
    });
}

export async function joinRoom(userUid, houseCode) {
  const user = await getUserByUid(userUid);
  await db
    .collection("rooms")
    .doc(houseCode)
    .get()
    .then((room) => {
      db.collection("rooms")
        .doc(room.id)
        .collection("members")
        .doc(userUid)
        .set({ ...user, uid: userUid });
      db.collection("users").doc(userUid).update({
        activeRoomUid: room.id,
      });
    })
    .catch((err) => {
      return err;
    });
}

export async function leaveRoom(userUid) {
  const user = await getUserByUid(userUid);
  await db
    .collection("rooms")
    .doc(user.activeRoomUid)
    .collection("members")
    .doc(userUid)
    .delete();
  db.collection("users").doc(userUid).update({
    activeRoomUid: "",
  });
}

export async function getUserActiveRoom(userUid) {
  let res = null;
  await db
    .collection("users")
    .doc(userUid)
    .get()
    .then(async (user) => {
      if (user.data().activeRoomUid) {
        await db
          .collection("rooms")
          .doc(user.data().activeRoomUid)
          .get()
          .then((room) => {
            if (room.exists) {
              res = { ...room.data(), uid: room.id };
            } else {
              console.log("not exists");
              res = null;
            }
          })
          .catch((err) => {
            res = err;
          });
      } else {
        res = null;
      }
    })
    .catch((err) => {
      res = err;
    });
  return res;
}
