import { Box, Button, Heading } from "grommet";
import { endMatch, toggleCup } from "../../service/Games";
import { useState } from "react";
import Team from "./Team";

export default function ResultClaim(props) {
  const [claimWinner, setClaimWinner] = useState();
  const opposition = props.currentTeam === "team1" ? "team2" : "team1";

  console.log(props.matchInProgress)

  return (
    <Box
      className={props.show ? "victory-screen show" : "victory-screen"}
      background="brand"
      flex
      align="center"
      justify="center"
      direction="column"
    >
      <Box
        flex="grow"
        pad="1em"
        fill
        align="center"
        justify="center"
        direction="column"
      >
        <p>Choose the winner</p>
        <Box
          width="100%"
          gap="16px"
          align="center"
          justify="center"
          direction="row"
          margin="32px"
        >
          <Box 
            align="center"
            pad="1em"
            fill
            justify="center"
            direction="column"
            className={claimWinner === "1" ? 'winner result-team-card' : 'result-team-card'}
            onClick={() => setClaimWinner('1')}
          >
            <Team
              team={props.teams.team1}
              currentTeam={props.currentTeam}
              table={props.table}
              teamId="team1"
              matchInProgress={props.matchInProgress}
            />
          </Box>
          <Box 
            align="center"
            pad="1em"
            fill
            justify="center"
            direction="column"
            className={claimWinner === "2" ? 'winner result-team-card' : 'result-team-card'}
            onClick={() => setClaimWinner('2')}
          >
            <Team
              team={props.teams.team2}
              currentTeam={props.currentTeam}
              table={props.table}
              teamId="team2"
              matchInProgress={props.matchInProgress}
            />
          </Box>
        </Box>
        <Button
          primary
          color="#1aa358"
          label="Submit"
          margin=".5em"
          disabled={!claimWinner}
        />
        <Button
          primary
          color="#FF4040"
          label="Cancel"
          onClick={props.oops}
        />
      </Box>
    </Box>
  );
}
