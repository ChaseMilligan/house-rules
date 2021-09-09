import { db } from "../config/firebase-config";
import { getUserByUid } from "./Users";

export async function joinTeam(userUid, gameUid, team) {
  const user = await getUserByUid(userUid);
  await db
    .collection("rooms")
    .doc(user.activeRoomUid)
    .collection("games")
    .doc(gameUid)
    .collection("teams")
    .doc(team)
    .collection("members")
    .doc(userUid)
    .set(user);
}

export async function leaveTeam(userUid, gameUid, team) {
  const user = await getUserByUid(userUid);
  console.log(userUid, gameUid, team);
  await db
    .collection("rooms")
    .doc(user.activeRoomUid)
    .collection("games")
    .doc(gameUid)
    .collection("teams")
    .doc(team)
    .collection("members")
    .doc(userUid)
    .delete();
}

export async function createTable(roomCode) {
  const timeStamp = new Date().getTime();
  await db
    .collection("rooms")
    .doc(roomCode)
    .collection("games")
    .add({ createdAt: timeStamp });
}

export async function deleteTable(roomCode, gameUid) {
  await db
    .collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .delete();
}
