import { db } from "../config/firebase-config";

export async function getUserByUid(uid) {
  let res = null;
  await db
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      res = doc.data();
    })
    .catch((err) => {
      res = err;
    });
  console.log(res);
  return res;
}
