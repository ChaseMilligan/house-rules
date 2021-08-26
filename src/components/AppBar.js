import react from "react";
import { Box } from "grommet";

export default function AppBar(props) {
  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="center"
      background="brand"
      pad={{ left: "medium", right: "small", vertical: "medium" }}
      elevation="medium"
      style={{ zIndex: "1" }}
      {...props}
    />
  );
}
