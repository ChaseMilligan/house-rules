import { Avatar, Box, Heading, Meter, Paragraph, Stack } from "grommet";
import { Home } from "grommet-icons";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { getProfileImageUrl } from "../service/Users";

export default function ProfileCard(props) {
  const [meterColor, setMeterColor] = useState("#FFAA15");
  const [avatarUrl, setAvatarURL] = useState();

  console.log(props.winLoss);

  useEffect(() => {
    if (props.winLoss > 52) {
      setMeterColor("#00C781");
    }
    if (props.winLoss < 48) {
      setMeterColor("#FF4040");
    }
  }, [props.winLoss]);

  useEffect(() => {
    getProfileImageUrl(props.uid).then((url) => setAvatarURL(url));
  }, []);
  return (
    <div className="profile-card-container">
      <Box flex direction="column" align="center" justify="around">
        <Stack anchor="top-right">
          <Avatar
            src={avatarUrl}
            background="dark-1"
            size={props.size || "xlarge"}
          >
            {props.name[0]}
          </Avatar>
          {props.homeOwner && (
            <Box background="brand" pad=".5em" round="50%" className="stack">
              <Home color="#0E79B2" />
            </Box>
          )}
        </Stack>
        <Heading level="2">{props.name}</Heading>
      </Box>
      <Box flex direction="row" align="center" justify="around">
        <Box flex direction="column" align="center" justify="center">
          <Heading margin={{ bottom: "0px" }} level="4">
            Games Played
          </Heading>
          <Paragraph margin={{ top: ".25em" }}>
            {props.totalMatchesPlayed || 0}
          </Paragraph>
        </Box>
        {props.totalMatchesPlayed !== undefined && (
          <div className="profile-card-visuals">
            {props.winLoss ? (
              <div className="profile-card-meter">
                <Meter
                  size="86px"
                  type="circle"
                  round
                  value={props.winLoss}
                  color={meterColor}
                />
                <Heading level="4">{props.winLoss}%</Heading>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

        {props.totalVictories !== undefined && (
          <Box flex direction="column" align="center" justify="center">
            <Heading margin={{ bottom: "0px" }} level="4">
              Victories
            </Heading>
            <Paragraph margin={{ top: ".25em" }}>
              {props.totalVictories}
            </Paragraph>
          </Box>
        )}
      </Box>
    </div>
  );
}
