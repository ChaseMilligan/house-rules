import { db } from "../config/firebase-config";
import { storage } from "./../config/firebase-config";

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
  return res;
}

export async function uploadProfileImage(userUid, file) {
  storage
    .child(`avatars/${userUid}`)
    .put(file)
    .then((snapshot) => {
      console.log(snapshot, "uploaded");
    });
}

export async function getProfileImageUrl(userUid) {
  let res = null;
  await storage
    .child(`avatars/${userUid}`)
    .getDownloadURL()
    .then((url) => {
      console.log(url);
      res = url;
    });
  console.log(res);
  return res;
}
