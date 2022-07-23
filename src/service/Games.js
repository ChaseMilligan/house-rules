import { db } from "../config/firebase-config";
import { getUserByUid } from "./Users";

export async function joinTeam(userUid, gameUid, team) {
  const user = await getUserByUid(userUid);
  console.log(userUid, gameUid, team, user);
  if (!userUid || !gameUid || !team || !user) {
    return;
  }
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

export async function startMatch(roomCode, gameUid, teams) {
  const timeStamp = new Date().getTime();

  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .set({ matchInProgress: timeStamp }, { merge: true });

  db.collection("rooms")
    .doc(roomCode)
    .collection("games")
    .doc(gameUid)
    .collection("matches")
    .doc(timeStamp.toString())
    .set({
      startedAt: timeStamp,
      teams,
      score: { team1: [1, 2, 3, 4, 5, 6], team2: [1, 2, 3, 4, 5, 6] },
      winnerId: "",
    });
}

export async function endMatch(
  roomCode,
  gameUid,
  teams,
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
    .collection("matches")
    .doc(matchInProgress.toString())
    .set(
      {
        winnerId: winnerId,
      },
      { merge: true }
    );

  if (winnerId !== "challenged") {
    Object.keys(teams).forEach((team) => {
      teams[team].forEach((memberId) => {
        console.log(memberId);
        db.collection("users")
          .doc(memberId)
          .get()
          .then((user) => {
            console.log(user.data(), team, winnerId);
            db.collection("users")
              .doc(memberId)
              .set(
                team !== winnerId
                  ? {
                      totalMatchesPlayed: user.data().totalMatchesPlayed
                        ? user.data().totalMatchesPlayed + 1
                        : 1,
                      totalVictories: user.data().totalVictories
                        ? user.data().totalVictories
                        : 0,
                    }
                  : {
                      totalMatchesPlayed: user.data().totalMatchesPlayed
                        ? user.data().totalMatchesPlayed + 1
                        : 1,
                      totalVictories: user.data().totalVictories
                        ? user.data().totalVictories + 1
                        : 1,
                    },
                { merge: true }
              );

            db.collection("rooms")
              .doc(roomCode)
              .collection("members")
              .doc(memberId)
              .set(
                team !== winnerId
                  ? {
                      totalMatchesPlayed: user.data().totalMatchesPlayed
                        ? user.data().totalMatchesPlayed + 1
                        : 1,
                      totalVictories: user.data().totalVictories
                        ? user.data().totalVictories
                        : 0,
                    }
                  : {
                      totalMatchesPlayed: user.data().totalMatchesPlayed
                        ? user.data().totalMatchesPlayed + 1
                        : 1,
                      totalVictories: user.data().totalVictories
                        ? user.data().totalVictories + 1
                        : 1,
                    },
                { merge: true }
              );
          })
          .catch((err) => {
            return err;
          });
      });
    });
  }
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
