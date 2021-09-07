import { Heading, Box, Button, Paragraph, Avatar } from "grommet";
import { Add } from "grommet-icons";
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
        <Box flex align="center" justify="start">
          <Button
            primary
            size="medium"
            label="Add Ranked Table"
            icon={<Add />}
            onClick={() => console.log("start")}
          />
        </Box>
        <Box
          pad=".5em 0px"
          margin="1em 0px"
          align="center"
          background="light-4"
        >
          <Heading level="2">CODE (RANKED)</Heading>
          <Box
            fill
            flex="grow"
            direction="column"
            align="center"
            justify="between"
          >
            <Box flex fill direction="row" align="center" justify="around">
              <Heading level="3">Player 1</Heading>
              <Heading level="3">&</Heading>
              <Heading level="3">Player 2</Heading>
            </Box>
            <Heading level="1">VS</Heading>
            <Box flex fill direction="row" align="center" justify="around">
              <Heading level="3">Player 3</Heading>
              <Heading level="3">&</Heading>
              <Heading level="3">Player 4</Heading>
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
}
