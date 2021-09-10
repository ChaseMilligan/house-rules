import { Heading, Box, Button, DropButton, Paragraph } from "grommet";
import {
  deleteTable,
  leaveTeam,
  startMatch,
  toggleCup,
} from "../../service/Games";
import { auth, db } from "../../config/firebase-config";
import { useState, useEffect } from "react";
import Loading from "../Loading";
import { PlayFill, Run, Trash, MoreVertical } from "grommet-icons";
import Team from "./Team";
import Rack from "./Rack";

export default function Table(props) {
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);

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

    db.collection("rooms")
      .doc(props.roomCode)
      .collection("games")
      .doc(props.table)
      .collection("matches")
      .limit(25)
      .onSnapshot((snapshot) => {
        if (!props.matchInProgress) {
          return;
        }
        setLoading(true);
        const matches = snapshot.docs.map((match) => match.data());
        console.log(matches, props.roomCode);

        db.collection("rooms")
          .doc(props.roomCode)
          .collection("games")
          .doc(props.table)
          .collection("matches")
          .doc(props.matchInProgress.toString())
          .get()
          .then((doc) => {
            if (doc.exists) {
              setCurrentMatch(doc.data());
            }
          });
        setLoading(false);
      });
  }, []);

  console.log(currentMatch);

  if (loading) {
    <Loading />;
  }
  return (
    <Box
      flex
      direction="column"
      key={props.index}
      align="center"
      className="game-table"
      background="status-disabled"
    >
      <Box
        flex="shrink"
        fill="horizontal"
        align="center"
        pad="0px 1.5em"
        justify="between"
        direction="row"
        margin={{ bottom: "1em" }}
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
      <Box flex fill direction="column" align="center" justify="between">
        {currentTeam === "team2" && teamOne.length === 0 ? (
          <Box flex fill align="center" justify="center">
            <Paragraph>Waiting for opponent...</Paragraph>
          </Box>
        ) : (
          <Box fill flex direction="row" align="center">
            <Team
              team={teamOne}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team1"
            />
            {currentMatch !== null && (
              <Rack
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team1"}
                table={props.table}
                matchInProgress={props.matchInProgress}
              />
            )}
          </Box>
        )}
        {currentTeam && !props.matchInProgress && (
          <Button
            label="Start Match"
            primary
            color="#1aa358"
            icon={<PlayFill />}
            onClick={() =>
              startMatch(props.roomCode, props.table, {
                team1: teamOne,
                team2: teamTwo,
              })
            }
            disabled={teamOne.length === 0 || teamTwo.length === 0}
          />
        )}
        {!currentTeam && !props.matchInProgress && (
          <Heading level="1">VS</Heading>
        )}
        {currentTeam === "team1" && teamTwo.length === 0 ? (
          <Box flex fill align="center" justify="center">
            <Paragraph>Waiting for opponent...</Paragraph>
          </Box>
        ) : (
          <Box fill flex direction="row" align="center">
            <Team
              team={teamTwo}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team2"
            />
            {currentMatch !== null && (
              <Rack
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team2"}
                table={props.table}
                matchInProgress={props.matchInProgress}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
