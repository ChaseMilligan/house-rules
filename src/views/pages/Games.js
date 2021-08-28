import { Tabs, Box, Button, Heading, Tab } from "grommet";
import { UserAdd, CloudUpload } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getUserByUid } from "../../service/Users";

export default function Games() {
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
    <Box flex align="center" justify="start" pad="medium">
      <div className="games-container container-fluid">
        <Box fill flex align="start" justify="start">
          <Tabs>
            <Tab title="Find Duo">
              <Box pad="medium">One</Box>
            </Tab>
            <Tab title="Teams">
              <Box pad="medium">Two</Box>
            </Tab>
            <Tab title="Matches">
              <Box pad="medium">Three</Box>
            </Tab>
          </Tabs>
        </Box>
      </div>
    </Box>
  );
}
