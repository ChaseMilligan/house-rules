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
    .doc(houseCode)
    .get()
    .then((room) => {
      console.log(room.data(), room.id);
      db.collection("rooms")
        .doc(room.id)
        .update({
          members: [...room.data().members, { ...user, uid: userUid }],
        });
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
    .get()
    .then((room) => {
      console.log("here");
      const filteredMembers = room.data().members.filter((member) => {
        console.log("hehe", member);
        return member.uid !== userUid;
      });
      console.log(filteredMembers);
      db.collection("rooms").doc(room.id).update({ members: filteredMembers });
      db.collection("users").doc(userUid).update({
        activeRoomUid: "",
      });
    })
    .catch((err) => {
      console.log("fail");
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
      await db
        .collection("rooms")
        .doc(user.data().activeRoomUid)
        .get()
        .then((room) => {
          if (room.exists) {
            res = { ...room.data(), uid: room.id };
          }
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
