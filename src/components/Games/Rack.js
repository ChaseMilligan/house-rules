import { Box } from "grommet";
import Cup from "./Cup";

export default function Rack(props) {
  return (
    <Box
      flex
      direction={props.teamId === "team1" ? "column-reverse" : "column"}
      wrap
      align="center"
      justify="center"
    >
      <Box width="100%" align="center">
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={1}
          teamId={props.teamId}
        />
      </Box>
      <Box width="100%" direction="row" align="center" justify="center">
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={2}
          teamId={props.teamId}
        />
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={3}
          teamId={props.teamId}
        />
      </Box>

      <Box width="100%" direction="row" align="center" justify="center">
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={4}
          teamId={props.teamId}
        />
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={5}
          teamId={props.teamId}
        />
        <Cup
          roomCode={props.roomCode}
          table={props.table}
          matchInProgress={props.matchInProgress}
          currentScore={props.currentMatch.score}
          cup={6}
          teamId={props.teamId}
        />
      </Box>
    </Box>
  );
}
