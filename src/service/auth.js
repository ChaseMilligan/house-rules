import { auth, db } from "../config/firebase-config";

const socialMediaAuth = (provider) => {
  auth
    .signInWithPopup(provider)
    .then((res) => {
      updateFirestore(res.user.email, res.user.displayName, res.user.uid);
      return res.user;
    })
    .catch((err) => {
      return err;
    });
};

export const emailPassAuth = (email, password) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      //Signed In
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorCode, errorMessage);
    });
};

export const createEmailPassAuth = (email, name, password) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      updateFirestore(email, name, userCredential.user.uid);
      emailPassAuth(email, password);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorCode, errorMessage);
    });
};

function updateFirestore(email, name, uid) {
  let data = {};

  data["email"] = email;
  data["name"] = name;

  db.collection("users")
    .doc(uid)
    .set(data)
    .then(() => {
      window.location.href = "/";
    })
    .catch((e) => {
      console.log(e);
    });
}

export default socialMediaAuth;
