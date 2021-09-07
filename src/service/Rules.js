import { db } from "../config/firebase-config";

export async function createRuleSet(userUid, name, rulesArray) {
  console.log(rulesArray);
  await db
    .collection("ruleSets")
    .doc(userUid)
    .get()
    .then(() => {
      console.log(userUid);
      db.collection("ruleSets")
        .doc(userUid)
        .collection("sets")
        .doc(name)
        .set({ rules: rulesArray });
    })
    .catch((err) => {
      return err;
    });
}

export async function deleteRuleSet(userUid, ruleSet) {
  await db
    .collection("ruleSets")
    .doc(userUid)
    .collection("sets")
    .doc(ruleSet.name)
    .delete();
}

export async function getUserRuleSets(userUid) {
  console.log(userUid);
  let res = null;
  await db
    .collection("ruleSets")
    .doc(userUid)
    .collection("sets")
    .get()
    .then((querySnapshot) => {
      let setsArray = [];
      querySnapshot.forEach((doc) => {
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
  await db
    .collection("ruleSets")
    .doc(userUid)
    .collection("sets")
    .doc(ruleSet.name)
    .set({ rules: newRules })
    .then(() => {
      return newRules;
    })
    .catch((err) => {
      return err;
    });
}
