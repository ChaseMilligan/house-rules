import { db } from "../config/firebase-config";
import { getUserByUid } from "./Users";

export async function joinTeam(userUid, gameUid, team) {
  const user = await getUserByUid(userUid);
  console.log(userUid, gameUid, team, user);
  if (!userUid || !gameUid || !team || !user) {
    return;
  }
  await db
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
    .collection("games")
    .doc(gameUid)
    .collection("teams")
    .doc(team)
    .collection("members")
    .doc(userUid)
    .delete();
}

export async function createTable(roomCode, userUid, user) {
  const timeStamp = new Date().getTime();
  const doc = await db
    .collection("games")
    .doc();

  doc.set({ createdAt: timeStamp });

  doc.collection('teams')
    .doc('team1')
    .collection('members')
    .doc(userUid)
    .set(user);

  doc.get()
    .then(async (doc) => {
      await db
      .collection("rooms")
      .doc(roomCode)
      .collection("games")
      .doc(doc.id)
      .set(doc.data())

      await db
      .collection("users")
      .doc(userUid)
      .collection("games")
      .doc(doc.id)
      .set(doc.data())
    })
    
}

export async function deleteTable(roomCode, gameUid) {
  await db
    .collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .delete();
}

export async function startMatch(roomCode, gameUid, teams) {
  const timeStamp = new Date().getTime();

  db.collection("games")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .set({ matchInProgress: timeStamp }, { merge: true });

  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .set({
      startedAt: timeStamp,
      winnerId: "",
    }, { merge: true });
}

export async function endMatch(
  roomCode,
  gameUid,
  winnerId,
  matchInProgress
) {
  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .set({ matchInProgress: "" }, { merge: true });

  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .set(
      {
        winnerId: winnerId,
      },
      { merge: true }
    );
}

export async function toggleCup(
  roomCode,
  gameUid,
  matchInProgress,
  cup,
  teamId
) {
  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .collection("matches")
    .doc(matchInProgress.toString())
    .get()
    .then((match) => {
      const currentScore = match.data().score[teamId];
      const opposition = teamId === "team1" ? "team2" : "team1";
      let newScore = {};
      console.log(currentScore, teamId);
      if (currentScore.includes(cup)) {
        newScore[teamId] = currentScore.filter((item) => item !== cup);
        console.log(newScore);
      } else {
        newScore[teamId] = [...currentScore, cup];
      }
      newScore[opposition] = match.data().score[opposition];
      console.log(newScore);
      db.collection("rooms")
        .doc(roomCode)
        .collection("games")
        .doc(gameUid)
        .collection("matches")
        .doc(matchInProgress.toString())
        .update({ score: newScore });
    });
}
