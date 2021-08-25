import { auth } from "../config/firebase-config";

const socialMediaAuth = (provider) => {
  auth
    .signInWithPopup(provider)
    .then((res) => {
      return res.user;
    })
    .catch((err) => {
      return err;
    });
};

export default socialMediaAuth;
