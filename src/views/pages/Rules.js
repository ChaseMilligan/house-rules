import { Avatar, Box, Button, Heading, FileInput } from "grommet";
import { Logout, CloudUpload } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getUserByUid } from "../../service/Users";

export default function Rules() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

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
    <Box flex align="center" justify="start">
      <div className="rules-container container-fluid">
        {user.activeRoomUid ? (
          <Heading>rules</Heading>
        ) : (
          <Heading>Default rules</Heading>
        )}
      </div>
    </Box>
  );
}
