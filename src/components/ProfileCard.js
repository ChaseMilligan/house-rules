import { Avatar, Box, Meter, Paragraph } from "grommet";
import { Home } from "grommet-icons";
import { useEffect, useState } from "react";

export default function ProfileCard(props) {
  const [meterColor, setMeterColor] = useState("#FFAA15");

  useEffect(() => {
    if (props.winLoss > 51.5) {
      setMeterColor("#00C781");
    }
    if (props.winLoss < 49.5) {
      setMeterColor("#FF4040");
    }
  }, [props.winLoss]);
  return (
    <div className="profile-card-container">
      <Box flex direction="row" align="center" justify="around">
        <Paragraph>{props.name}</Paragraph>
        {props.homeOwner && <Home />}
      </Box>
      <div className="profile-card-visuals">
        <Avatar src={props.avatarUrl} background="brand" size="xlarge">
          {props.name[0]}
        </Avatar>
        {props.winLoss ? (
          <div className="profile-card-meter">
            <Meter
              size="xsmall"
              type="circle"
              value={props.winLoss}
              color={meterColor}
            />
            <span>{props.winLoss}%</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}