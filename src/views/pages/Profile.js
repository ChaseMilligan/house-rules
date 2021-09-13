import {
  Avatar,
  Box,
  Button,
  FormField,
  Heading,
  FileInput,
  TextArea,
} from "grommet";
import { Logout, CloudUpload } from "grommet-icons";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { auth } from "../../config/firebase-config";
import {
  getProfileImageUrl,
  getUserByUid,
  uploadProfileImage,
} from "./../../service/Users";

export default function Profile() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [avatarUrl, setAvatarURL] = useState();

  function handleSignOut() {
    setLoading(true);
    auth
      .signOut()
      .then((res) => {
        setLoading(false);
        return res;
      })
      .catch((err) => {
        setLoading(false);
        return err;
      });
  }

  async function handleUploadNewAvatar() {
    await uploadProfileImage(auth.currentUser.uid, fileToUpload);
    getProfileImageUrl(auth.currentUser.uid).then((url) => setAvatarURL(url));
    setFileToUpload();
  }

  useEffect(() => {
    setLoading(true);
    getUserByUid(auth.currentUser.uid).then((data) => {
      setUser(data);
      setLoading(false);
    });
    getProfileImageUrl(auth.currentUser.uid).then((url) => setAvatarURL(url));
  }, []);

  console.log(avatarUrl);

  if (loading) {
    <Loading />;
  }

  return (
    <Box flex align="center" justify="start" pad="2em">
      {user ? (
        <div className="container-fluid">
          <Box flex align="center" justify="center">
            <Avatar
              margin=".5em 0px"
              src={avatarUrl || null}
              background="brand"
              size="5xl"
            >
              {user.name[0]}
            </Avatar>
            <Heading>{user.name}</Heading>
          </Box>
          <Box flex direction="column" margin="1em 0px">
            <FileInput
              name="file"
              onChange={(event) => {
                const fileList = event.target.files;
                for (let i = 0; i < fileList.length; i += 1) {
                  const file = fileList[i];
                  console.log(file);
                  setFileToUpload(file);
                }
              }}
            />
            <Button
              active={!!fileToUpload}
              margin=".5em 0px"
              size="large"
              primary
              label="Upload"
              icon={<CloudUpload />}
              onClick={() => handleUploadNewAvatar()}
            />
            <Button
              primary
              margin="2em 0px"
              size="large"
              label="Sign Out"
              icon={<Logout />}
              onClick={() => handleSignOut()}
            />
          </Box>
        </div>
      ) : (
        <p>no user found</p>
      )}
    </Box>
  );
}
