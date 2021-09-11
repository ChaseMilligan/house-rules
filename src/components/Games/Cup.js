import { Box } from "grommet";
import { toggleCup } from "../../service/Games";

export default function Cup(props) {
  console.log(props.isUserPlaying, props.currentTeam);
  return (
    <Box
      onClick={
        props.isUserPlaying && props.currentTeam !== props.teamId
          ? () =>
              toggleCup(
                props.roomCode,
                props.table,
                props.matchInProgress,
                props.cup,
                props.teamId
              )
          : () => {
              console.log(
                props.isUserPlaying,
                props.currentTeam !== props.teamId
              );
              return;
            }
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
