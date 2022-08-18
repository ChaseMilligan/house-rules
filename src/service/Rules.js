import { db } from '../config/firebase-config';

export async function createRuleSet(userUid, name, rulesArray) {
	await db
		.collection('ruleSets')
		.doc(userUid)
		.get()
		.then(() => {
			db.collection('ruleSets')
				.doc(userUid)
				.collection('sets')
				.doc(name)
				.set({ rules: rulesArray, index: rulesArray.length });
		})
		.catch((err) => {
			return err;
		});
}

export async function deleteRuleSet(userUid, ruleSet) {
	await db
		.collection('ruleSets')
		.doc(userUid)
		.collection('sets')
		.doc(ruleSet.name)
		.delete();
}

export async function getUserRuleSets(userUid) {
	let res = null;
	await db
		.collection('ruleSets')
		.doc(userUid)
		.collection('sets')
		.get()
		.then((querySnapshot) => {
			let setsArray = [];
			querySnapshot.docs.forEach((doc) => {
				setsArray.push({ name: doc.id, rules: doc.data() });
			});
			res = setsArray;
		})
		.catch((err) => {
			res = [err];
		});
	return res;
}

export async function overwriteRules(userUid, ruleSet, newRules) {
	console.log(ruleSet);
	await db
		.collection('ruleSets')
		.doc(userUid)
		.collection('sets')
		.doc(ruleSet)
		.set({ rules: newRules }, { merge: true })
		.then(() => {
			return newRules;
		})
		.catch((err) => {
			return err;
		});
}

export async function rearrangeRuleSets(newRuleSets, userUid) {
	newRuleSets.forEach((ruleSet, index) => {
		console.log(ruleSet);
		db.collection('ruleSets')
			.doc(userUid)
			.collection('sets')
			.doc(ruleSet.name)
			.set({ index: index }, { merge: true });
	});
}
