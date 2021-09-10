import { Box } from "grommet";
import { toggleCup } from "../../service/Games";

export default function Cup(props) {
  return (
    <Box
      onClick={() =>
        toggleCup(
          props.roomCode,
          props.table,
          props.matchInProgress,
          props.cup,
          props.teamId
        )
      }
      background={
        props.currentScore[props.teamId].includes(props.cup)
          ? "status-critical"
          : "dark-6"
      }
      className={
        props.currentScore[props.teamId].includes(props.cup) ? "cup" : "cup hit"
      }
    />
  );
}
