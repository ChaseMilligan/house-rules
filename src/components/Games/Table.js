import { Heading, Box, Button, DropButton, Paragraph } from "grommet";
import { deleteTable, leaveTeam, startMatch } from "../../service/Games";
import { auth, db } from "../../config/firebase-config";
import { useState, useEffect } from "react";
import Loading from "../Loading";
import { PlayFill, Run, Trash, MoreVertical, Add } from "grommet-icons";
import Team from "./Team";
import Rack from "./Rack";
import Victory from "./Victory";

export default function Table(props) {
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isUserPlaying, setIsUserPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function handleGetTeamOne() {
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
              if (props.matchInProgress) {
                setIsUserPlaying(props.matchInProgress.toString());
              }
            }
          });

        setTeamOne(
          snapshot.docs.map((member) => ({
            data: member.data(),
            id: member.id,
          }))
        );
      });
  }

  function handleGetTeamTwo() {
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
              setCurrentTeam("team2");
              if (props.matchInProgress) {
                console.log(props.matchInProgress);
                setIsUserPlaying(props.matchInProgress.toString());
              }
            }
          });

        setTeamTwo(
          snapshot.docs.map((member) => ({
            data: member.data(),
            id: member.id,
          }))
        );
      });
  }

  useEffect(() => {
    if (currentMatch === null) {
      return;
    }
    if (currentMatch.score["team1"].length === 0) {
      setShowResult(true);
      return;
    }
    if (currentMatch.score["team2"].length === 0) {
      setShowResult(true);
      return;
    }
    setShowResult(false);
  }, [currentMatch]);

  useEffect(() => {
    console.log("hit");
    setCurrentMatch(null);
    if (!props.matchInProgress) {
      console.log(props.matchInProgress);
      return;
    }
    setLoading(true);
    db.collection("rooms")
      .doc(props.roomCode)
      .collection("games")
      .doc(props.table)
      .collection("matches")
      .limit(25)
      .onSnapshot((snapshot) => {
        setLoading(true);

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
      });
    handleGetTeamOne();
    handleGetTeamTwo();
    setLoading(false);
  }, [props.matchInProgress, props.roomCode, props.table]);

  useEffect(() => {
    setLoading(true);
    handleGetTeamOne();
    handleGetTeamTwo();
    setLoading(false);
  }, []);

  console.log(props.matchInProgress, currentMatch);

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
      {props.matchInProgress && currentMatch && currentTeam && (
        <Victory
          show={showResult}
          roomCode={props.roomCode}
          gameUid={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={currentMatch.score}
          currentTeam={currentTeam}
          teams={{
            team1: teamOne.map((member) => member.id),
            team2: teamTwo.map((member) => member.id),
          }}
        />
      )}

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

                { !props.matchInProgress && (
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

                { props.matchInProgress && (
                  <Button
                    margin=".5em 0px"
                    primary
                    label="Call Next"
                    color="status-info"
                    gap="xxsmall"
                    onClick={ () => deleteTable(props.roomCode, props.table) }
                    icon={ <Add size="medium" /> }
                  />
                ) }
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
          <Box
            fill
            flex
            direction="row"
            align="center"
            className={
              props.matchInProgress
                ? "team-container bottom-divider"
                : "team-container"
            }
          >
            <Team
              team={teamOne}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team1"
              matchInProgress={props.matchInProgress}
            />
            {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
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
          <Box
            fill
            flex
            direction="row"
            align="center"
            className="team-container"
          >
            <Team
              team={teamTwo}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team2"
              matchInProgress={props.matchInProgress}
            />
            {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
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
