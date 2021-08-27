import { db } from "../config/firebase-config";

export async function updateDefaultRules(userUid, rulesArray) {
  if (!userUid || !rulesArray) {
    return "error";
  }
  const result = await db
    .collection("users")
    .doc(userUid)
    .get()
    .then(() => {
      console.log(userUid);
      db.collection("users")
        .doc(userUid)
        .set({ defaultRules: rulesArray }, { merge: true });
    })
    .catch((err) => {
      return err;
    });
  console.log(result, "hehe");
}