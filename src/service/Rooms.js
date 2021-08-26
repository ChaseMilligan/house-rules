import { db } from "../config/firebase-config";
import { getRoomCode } from "../scripts/helpers";
import { getUserByUid } from "./Users";

export async function createRoom(userUid) {
  const user = await getUserByUid(userUid);
  const roomCode = getRoomCode();
  await db
    .collection("rooms")
    .doc(roomCode)
    .set({
      members: [{ ...user, uid: userUid }],
      games: [],
    })
    .then(() => {
      db.collection("users").doc(userUid).update({ activeRoomUid: roomCode });
    })
    .catch((err) => {
      return err;
    });
}

export async function joinRoom(userUid, houseCode) {
  const user = await getUserByUid(userUid);
  await db
    .collection("rooms")
    .where("code", "==", houseCode)
    .get()
    .then((snap) => {
      snap.forEach((room) => {
        console.log(room.data(), room.id);
        db.collection("rooms")
          .doc(room.id)
          .update({
            members: [...room.data().members, { ...user, uid: userUid }],
          });
        db.collection("users").doc(userUid).update({
          activeRoomUid: room.id,
        });
      });
    })
    .catch((err) => {
      return err;
    });
}

export async function getUserActiveRoom(userUid) {
  let res = null;
  await db
    .collection("users")
    .doc(userUid)
    .get()
    .then(async (user) => {
      console.log(user.data());
      await db
        .collection("rooms")
        .doc(user.data().activeRoomUid)
        .get()
        .then((room) => {
          res = { ...room.data(), uid: room.id };
        })
        .catch((err) => {
          res = null;
        });
    })
    .catch((err) => {
      res = null;
    });
  return res;
}
