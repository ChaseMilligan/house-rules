import { Box, Button } from "grommet";
import { Logout } from "grommet-icons";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { auth } from "../../config/firebase-config";
import { getUserByUid } from "./../../service/Users";

export default function Profile() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  function handleSignOut() {
    setLoading(true);
    const signOut = auth
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
      <h1>Profile</h1>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <Button
            primary
            label="Sign Out"
            icon={<Logout />}
            onClick={() => handleSignOut()}
          />
        </>
      ) : (
        <p>no user found</p>
      )}
    </Box>
  );
}
