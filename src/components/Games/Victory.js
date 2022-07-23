import { Box, Button, Heading } from "grommet";
import { endMatch, toggleCup } from "../../service/Games";

export default function Victory(props) {
  const opposition = props.currentTeam === "team1" ? "team2" : "team1";
  function Oops() {
    toggleCup(
      props.roomCode,
      props.gameUid,
      props.matchInProgress,
      1,
      opposition
    );
  }

  console.log(props.teams);

  return (
    <Box
      className={props.show ? "victory-screen show" : "victory-screen"}
      background="brand"
      flex
      align="center"
      justify="center"
      direction="column"
    >
      {props.currentScore[props.currentTeam].length === 0 ? (
        <Box
          flex="grow"
          pad="1em"
          fill
          align="center"
          justify="center"
          direction="column"
        >
          <h1 style={{ color: "#fff", fontSize: "6em" }}>Defeat!</h1>

          <Button
            primary
            color="#FF4040"
            size="large"
            label="Accept Defeat"
            margin="1em"
            onClick={() =>
              endMatch(
                props.roomCode,
                props.gameUid,
                props.teams,
                opposition,
                props.matchInProgress
              )
            }
          />
          <Button
            primary
            color="#ff8800"
            size="large"
            label="Challenge Game"
            margin="1em"
            onClick={() =>
              endMatch(
                props.roomCode,
                props.gameUid,
                props.teams,
                "challenged",
                props.matchInProgress
              )
            }
          />
        </Box>
      ) : (
        <Box
          flex="grow"
          pad="1em"
          fill
          align="center"
          justify="center"
          direction="column"
        >
          <h1 style={{ color: "#fff", fontSize: "6em" }}>Victory!</h1>
          <Heading level="2" color="#fff" style={{ textAlign: "center" }}>
            Waiting for opponents' response...
          </Heading>
          <Button
            primary
            color="#FF4040"
            size="large"
            label="Oops..."
            margin="1em"
            onClick={Oops}
          />
        </Box>
      )}
    </Box>
  );
}
