import { db } from '../config/firebase-config';
import { getUserByUid } from './Users';

export async function joinTeam(userUid, gameUid, team) {
	const user = await getUserByUid(userUid);
	if (!userUid || !gameUid || !team || !user) {
		return;
	}

	const gameDoc = db.collection('games').doc(gameUid);

	await gameDoc
		.collection('teams')
		.doc(team)
		.collection('members')
		.doc(userUid)
		.set(user);

	await gameDoc.get().then(async (doc) => {
		await db
			.collection('users')
			.doc(userUid)
			.collection('games')
			.doc(gameUid)
			.set(doc.data());

		await db
			.collection('users')
			.doc(userUid)
			.collection('games')
			.doc(doc.id)
			.set({ teamId: team }, { merge: true });
	});
}

export async function leaveTeam(userUid, gameUid, team) {
	await db
		.collection('games')
		.doc(gameUid)
		.collection('teams')
		.doc(team)
		.collection('members')
		.doc(userUid)
		.delete();

	await db
		.collection('users')
		.doc(userUid)
		.collection('games')
		.doc(gameUid)
		.delete();
}

export async function getGameByUid(uid) {
	let res = null;
	await db
		.collection('games')
		.doc(uid)
		.get()
		.then((doc) => {
			res = doc.data();
		})
		.catch((err) => {
			res = err;
		});
	return res;
}

export async function createTable(roomCode, userUid, user) {
	const timeStamp = new Date().getTime();
	const doc = await db.collection('games').doc();

	doc.set({ createdAt: timeStamp });

	doc
		.collection('teams')
		.doc('team1')
		.collection('members')
		.doc(userUid)
		.set(user);

	doc.get().then(async (doc) => {
		await db
			.collection('rooms')
			.doc(roomCode)
			.collection('games')
			.doc(doc.id)
			.set(doc.data());

		await db
			.collection('users')
			.doc(userUid)
			.collection('games')
			.doc(doc.id)
			.set(doc.data());

		await db
			.collection('users')
			.doc(userUid)
			.collection('games')
			.doc(doc.id)
			.set({ teamId: 'team1' }, { merge: true });
	});

	db.collection('rooms')
		.doc(roomCode)
		.get()
		.then((room) => {
			doc.set({ roomOwnerUid: room.data().roomOwner.uid }, { merge: true });
		})
		.catch((err) => {
			console.log(err);
		});
}

export async function deleteTable(roomCode, gameUid) {
	const doc = await db.collection('games').doc(gameUid);

	await db
		.collection('rooms')
		.doc(roomCode)
		.collection('games')
		.doc(gameUid)
		.delete();

	await doc
		.collection('teams')
		.doc('team1')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.delete();
			});
		});

	await doc
		.collection('teams')
		.doc('team2')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.delete();
			});
		});

	await doc.delete();
}

export async function startMatch(roomCode, gameUid) {
	const timeStamp = new Date().getTime();
	const doc = await db.collection('games').doc(gameUid);

	await doc
		.set({ matchInProgress: timeStamp }, { merge: true })
		.then(async () => {
			await db
				.collection('rooms')
				.doc(roomCode)
				.collection('games')
				.doc(gameUid)
				.set({ matchInProgress: timeStamp }, { merge: true });
		});

	await doc
		.collection('teams')
		.doc('team1')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.set({ matchInProgress: timeStamp }, { merge: true });
			});
		});

	await doc
		.collection('teams')
		.doc('team2')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.set({ matchInProgress: timeStamp }, { merge: true });
			});
		});
}

export async function endMatch(roomCode, gameUid, winnerId, timeStamp) {
	const doc = await db.collection('games').doc(gameUid);

	await doc.set({ endedAt: timeStamp, winnerId: winnerId }, { merge: true });

	db.collection('rooms')
		.doc(roomCode)
		.collection('games')
		.doc(gameUid)
		.set({ endedAt: timeStamp, winnerId: winnerId }, { merge: true });

	await doc
		.collection('teams')
		.doc('team1')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.set({ endedAt: timeStamp, winnerId: winnerId }, { merge: true });
			});
		});

	await doc
		.collection('teams')
		.doc('team2')
		.collection('members')
		.get()
		.then((snapshot) => {
			snapshot.docs.map(async (doc) => {
				await db
					.collection('users')
					.doc(doc.id)
					.collection('games')
					.doc(gameUid)
					.set({ endedAt: timeStamp, winnerId: winnerId }, { merge: true });
			});
		});
}

export async function reportStats(roomCode, gameUid, userUid, currentTeam, cupArray, eyeToEye, redemptionCount)
{
	console.log(gameUid)
	const doc = await db.collection('games').doc(gameUid).collection('teams').doc(currentTeam).collection('members').doc(userUid);

	await doc.set({ statsReported: true, cupArray: cupArray, eyeToEye: eyeToEye, redemptionCount: redemptionCount }, { merge: true });

	db.collection('rooms')
		.doc(roomCode)
		.collection('games')
		.doc(gameUid)
		.get()
		.then((game) =>
		{
			const reports = game.data().reports || [];
			reports.push(userUid);
			db.collection('rooms')
				.doc(roomCode)
				.collection('games')
				.doc(gameUid)
				.set({ reports: reports }, { merge: true });
		})


}
