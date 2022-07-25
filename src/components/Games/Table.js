import { Heading, Box, Button, DropButton, Paragraph } from "grommet";
import { deleteTable, leaveTeam, startMatch, endMatch } from "../../service/Games";
import { auth, db } from "../../config/firebase-config";
import { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
import { PlayFill, StopFill, Run, Trash, MoreVertical, Add } from "grommet-icons";
import Team from "./Team";
import ResultClaim from './ResultClaim';

export default function Table(props) {
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [ currentTeam, setCurrentTeam ] = useState(null);
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
              if (props.matchInProgress && !props.endedAt)
              {
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
        setLoading(false);
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
              if (props.matchInProgress && !props.endedAt)
              {
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
        setLoading(false);
      });
  }

  var timerInterval;

  function timer()
  {
    if (!timerEl.current)
    {
      return;
    }
    console.log(props.endedAt)
    const timeStamp = props.endedAt || new Date().getTime();
    const difference = timeStamp - props.matchInProgress;
    const minutes = Math.floor(difference / 60000);
    const seconds = ((difference % 60000) / 1000).toFixed(0);
    timerEl.current.innerHTML = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  useEffect(() =>
  {
    if (!props.matchInProgress) {
      console.log(props.matchInProgress);
      return;
    }
    setLoading(true);

    handleGetTeamOne();
    handleGetTeamTwo();

  }, [ props.matchInProgress, props.roomCode, props.table, props.endedAt ]);

  useEffect(() => {
    setLoading(true);
    handleGetTeamOne();
    handleGetTeamTwo();
  }, []);

  if (timerEl.current)
  {
    if (props.matchInProgress && !props.endedAt)
    {
      console.log('hihihihihihi')
      timerInterval = setInterval(timer, 1000);
    }


    if (props.endedAt)
    {
      console.log('here')
      clearInterval(timerInterval)
      timerInterval = null;
      const difference = props.endedAt - props.matchInProgress;
      const minutes = Math.floor(difference / 60000);
      const seconds = ((difference % 60000) / 1000).toFixed(0);
      timerEl.current.innerHTML = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
  }

  if (loading) {
    <Loading />;
  }
  return (
    <Box
      flex
      direction="column"
      key={props.index}
      align="center"
      className={ props.endedAt ? "game-table ended" : 'game-table' }
      background="status-disabled"
    >

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
        { (currentTeam !== null) && (
          <DropButton
            size="small"
            icon={<MoreVertical color="brand" size="medium" />}
            dropAlign={{ top: "bottom", right: "right" }}
            dropContent={
              <Box pad=".5em" background="light-2" fill>
                {currentTeam !== null && (
                  <>
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
                  <Button
                    margin=".5em 0px"
                    primary
                    label="Delete Table"
                    color="status-error"
                    gap="xxsmall"
                    onClick={() => deleteTable(props.roomCode, props.table)}
                    icon={<Trash size="medium" />}
                  />
                  </>
                ) }

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
      <Box flex fill direction={ props.endedAt ? "row" : "column" } align="center" justify="between">
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
              className={ props.winnerId === "team1" ? "team-container winner" : "team-container" }
          >
            <Team
              team={teamOne}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team1"
                winnerId={ props.winnerId }
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
        { currentTeam && !props.matchInProgress && !props.endedAt && (
          <Button
            label="Start Match"
            primary
            color="#1aa358"
            icon={<PlayFill />}
            onClick={() =>
              startMatch(props.roomCode, props.table)
            }
            disabled={teamOne.length === 0 || teamTwo.length === 0}
          />
        )}
        { currentTeam && props.matchInProgress && !props.endedAt && (
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
              className={ props.winnerId === "team2" ? "team-container winner" : "team-container" }
          >
            <Team
              team={teamTwo}
              currentTeam={currentTeam}
              table={props.table}
              teamId="team2"
                winnerId={ props.winnerId }
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
