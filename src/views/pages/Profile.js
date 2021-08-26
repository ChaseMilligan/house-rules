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
import { getUserByUid } from "./../../service/Users";

export default function Profile() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

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

  function handleUploadNewAvatar() {}

  useEffect(() => {
    setLoading(true);
    getUserByUid(auth.currentUser.uid).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    <Loading />;
  }

  return (
    <Box flex align="center" justify="center">
      {user ? (
        <div className="container-fluid">
          <Box flex align="center" justify="center">
            <Avatar
              margin=".5em 0px"
              src={user.avatarUrl || null}
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
          </Box>
          <Button
            primary
            margin="2em 0px"
            size="large"
            label="Sign Out"
            icon={<Logout />}
            onClick={() => handleSignOut()}
          />
        </div>
      ) : (
        <p>no user found</p>
      )}
    </Box>
  );
}
