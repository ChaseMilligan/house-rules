import { Box, Spinner } from "grommet";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { auth } from "../../config/firebase-config";
import { getUserByUid } from "./../../service/Users";

export default function Profile() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserByUid(auth.currentUser.uid).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return (
    <Box flex align="center" justify="center">
      <h1>Profile</h1>
      {!user && loading ? (
        <Loading />
      ) : (
        <>
          {user ? (
            <>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </>
          ) : (
            <p>no user found</p>
          )}
        </>
      )}
    </Box>
  );
}
