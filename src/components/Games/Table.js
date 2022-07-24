import { Heading, Box, Button, DropButton, Paragraph } from "grommet";
import { deleteTable, leaveTeam, startMatch, endMatch } from "../../service/Games";
import { auth, db } from "../../config/firebase-config";
import { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
import { PlayFill, StopFill, Run, Trash, MoreVertical, Add } from "grommet-icons";
import Team from "./Team";
import Rack from "./Rack";
import Victory from "./Victory";
import ResultClaim from './ResultClaim';

export default function Table(props) {
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isUserPlaying, setIsUserPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultClaimState, setResultClaimState] = useState(false);
  const timerEl = useRef();

  function handleGetTeamOne() {
    db.collection("games")
      .doc(props.table)
      .collection("teams")
      .doc("team1")
      .collection("members")
      .limit(25)
      .onSnapshot(async (snapshot) => {
        setLoading(true);
        db.collection("games")
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
    db.collection("games")
      .doc(props.table)
      .collection("teams")
      .doc("team2")
      .collection("members")
      .limit(25)
      .onSnapshot(async (snapshot) => {
        setLoading(true);
        db.collection("games")
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
    setCurrentMatch(null);
    if (!props.matchInProgress) {
      console.log(props.matchInProgress);
      return;
    }
    setLoading(true);

    handleGetTeamOne();
    handleGetTeamTwo();
    setLoading(false);
    const timerInterval = setInterval(() => {
      if (!timerEl.current) {
        return;
      }
      const timeStamp = new Date().getTime();
      const difference = timeStamp - props.matchInProgress;
      const minutes = Math.floor(difference / 60000);
      const seconds = ((difference % 60000) / 1000).toFixed(0);
      timerEl.current.innerHTML = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }, 1000);
  }, [props.matchInProgress, props.roomCode, props.table]);

  useEffect(() => {
    setLoading(true);
    handleGetTeamOne();
    handleGetTeamTwo();
    setLoading(false);
  }, []);

  console.log(resultClaimState)

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

      {resultClaimState && (
        <ResultClaim
          show={resultClaimState}
          oops={() => setResultClaimState(false)}
          roomCode={props.roomCode}
          claimTime={timerEl.current.innerHTML}
          gameUid={props.table}
          matchInProgress={props.matchInProgress}
          currentTeam={currentTeam}
          table={props.table}
          teams={{
            team1: teamOne.map((member) => member),
            team2: teamTwo.map((member) => member),
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
        <Heading level="2">Game {props.index + 1}</Heading>
        <Heading ref={timerEl}></Heading>
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
            className="team-container"
          >
            <Team
              team={teamOne}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team1"
              matchInProgress={props.matchInProgress}
            />
            {/* {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team1"}
                table={props.table}
                matchInProgress={props.matchInProgress}
              />
            )} */}
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
        {currentTeam && props.matchInProgress && (
          <Button
            label="End Match"
            primary
            color="#FF4040"
            icon={<StopFill />}
            onClick={() => setResultClaimState(true)}
            disabled={!currentTeam && !props.matchInProgress}
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
            {/* {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team2"}
                table={props.table}
                matchInProgress={props.matchInProgress}
              />
            )} */}
          </Box>
        )}
      </Box>
    </Box>
  );
}
