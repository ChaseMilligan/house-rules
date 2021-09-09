import { Heading, Box, Button, Avatar, DropButton, Layer } from "grommet";
import { deleteTable, joinTeam, leaveTeam } from "../../service/Games";
import { auth, db } from "../../config/firebase-config";
import { useEffect } from "react/cjs/react.development";
import { useState } from "react";
import Loading from "../Loading";
import { Add, Run, Trash, MoreVertical } from "grommet-icons";

export default function Table(props) {
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    db.collection("rooms")
      .doc(props.roomCode)
      .collection("games")
      .doc(props.table)
      .collection("teams")
      .doc("team1")
      .collection("members")
      .limit(25)
      .onSnapshot(async (snapshot) => {
        setLoading(true);
        db.collection("rooms")
          .doc(props.roomCode)
          .collection("games")
          .doc(props.table)
          .collection("teams")
          .doc("team1")
          .collection("members")
          .doc(auth.currentUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setCurrentTeam("team1");
            }
          });

        setTeamOne(snapshot.docs.map((member) => member.data()));
        setLoading(false);
      });

    db.collection("rooms")
      .doc(props.roomCode)
      .collection("games")
      .doc(props.table)
      .collection("teams")
      .doc("team2")
      .collection("members")
      .limit(25)
      .onSnapshot(async (snapshot) => {
        setLoading(true);
        db.collection("rooms")
          .doc(props.roomCode)
          .collection("games")
          .doc(props.table)
          .collection("teams")
          .doc("team2")
          .collection("members")
          .doc(auth.currentUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log(doc.data());
              setCurrentTeam("team2");
            }
          });

        setTeamTwo(snapshot.docs.map((member) => member.data()));
        setLoading(false);
      });
  }, []);

  console.log(currentTeam);

  if (loading) {
    <Loading />;
  }
  return (
    <Box
      flex
      direction="column"
      key={props.index}
      pad=".5em 0px"
      align="center"
      className="game-table"
      background="light-3"
    >
      <Box
        flex="shrink"
        fill="horizontal"
        align="center"
        pad="0px 1.5em"
        justify="between"
        direction="row"
      >
        <Heading level="2">Table {props.index + 1}</Heading>
        {(currentTeam !== null || props.roomOwner) && (
          <DropButton
            size="small"
            icon={<MoreVertical color="brand" size="medium" />}
            dropAlign={{ top: "bottom", right: "right" }}
            dropContent={
              <Box pad=".5em" background="light-2" fill>
                {currentTeam !== null && (
                  <Button
                    primary
                    margin=".5em 0px"
                    color="status-critical"
                    gap="xxsmall"
                    label="Leave"
                    onClick={() => {
                      setCurrentTeam(null);
                      leaveTeam(auth.currentUser.uid, props.table, currentTeam);
                    }}
                    icon={<Run size="medium" />}
                  />
                )}

                {props.roomOwner && (
                  <Button
                    margin=".5em 0px"
                    primary
                    label="Delete Table"
                    color="status-error"
                    gap="xxsmall"
                    onClick={() => deleteTable(props.roomCode, props.table)}
                    icon={<Trash size="medium" />}
                  />
                )}
              </Box>
            }
          />
        )}
      </Box>
      <Box
        flex
        fill
        direction="column"
        align="center"
        margin="1.5em 0px"
        justify="between"
      >
        <Box flex fill direction="row" align="center" justify="between">
          {teamOne.map((member, index) => (
            <Box
              flex="grow"
              margin="0px 1em"
              key={index}
              direction="column"
              align="center"
            >
              <Avatar background="brand" size="medium">
                {member.name[0]}
              </Avatar>
              <p>{member.name}</p>
            </Box>
          ))}
          {!currentTeam && (
            <Box margin="0px 1em" flex="grow" direction="column" align="center">
              <Button
                primary
                margin="0px 1em"
                disabled={currentTeam !== null}
                icon={<Add size="small" />}
                gap="xxsmall"
                size="small"
                label="Join Team"
                onClick={() =>
                  joinTeam(auth.currentUser.uid, props.table, "team1")
                }
              />
            </Box>
          )}
        </Box>
        <Heading level="1">VS</Heading>
        <Box flex fill direction="row" align="center" justify="between">
          {teamTwo.map((member, index) => (
            <Box
              margin="0px 1em"
              key={index}
              flex="grow"
              direction="column"
              align="center"
            >
              <Avatar background="brand" size="medium">
                {member.name[0]}
              </Avatar>
              <p>{member.name}</p>
            </Box>
          ))}
          {!currentTeam && (
            <Box margin="0px 1em" flex="grow" direction="column" align="center">
              <Button
                primary
                disabled={currentTeam !== null}
                icon={<Add size="small" />}
                gap="xxsmall"
                size="small"
                label="Join Team"
                onClick={() =>
                  joinTeam(auth.currentUser.uid, props.table, "team2")
                }
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
