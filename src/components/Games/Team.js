import { Box, Button, Avatar } from "grommet";
import { Add } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { joinTeam } from "../../service/Games";

export default function Team(props) {
  return (
    <Box
      flex
      fill
      direction="row"
      align={props.teamId === "team1" ? "start" : "end"}
      justify="between"
    >
      {props.team.map((member, index) => (
        <Box
          flex="grow"
          width="50%"
          key={index}
          direction="column"
          align="center"
        >
          <Avatar background="brand" size="medium">
            {member.name[0]}
          </Avatar>
          <p>{member.name}</p>
        </Box>
      ))}
      {!props.currentTeam && (
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
