import { Box, Button, Avatar } from "grommet";
import { Add } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { joinTeam } from "../../service/Games";

export default function Team(props) {
  return (
    <Box
      flex
      fill
      direction={props.matchInProgress ? "column" : "row"}
      align={props.teamId === "team1" ? "start" : "end"}
      justify="between"
      className={props.matchInProgress ? "playing" : ""}
    >
      {props.team.map((member, index) => (
        <Box
          flex="grow"
          width={props.matchInProgress ? "100%" : "50%"}
          key={index}
          direction="column"
          align="center"
          justify="center"
        >
          <Avatar background="brand" size="medium">
            {member.data.name[0]}
          </Avatar>
          <p>{member.data.name}</p>
        </Box>
      ))}
      {!props.currentTeam && !props.matchInProgress && (
        <Box width="50%" flex="grow" direction="column" align="center">
          <Button
            style={{ borderRadius: "50%" }}
            primary
            margin="0px 1em"
            disabled={props.currentTeam !== null}
            icon={<Add />}
            gap="xxsmall"
            onClick={() =>
              joinTeam(auth.currentUser.uid, props.table, props.teamId)
            }
          />
          <p>Join Team</p>
        </Box>
      )}
    </Box>
  );
}
