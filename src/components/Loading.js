import { Box, Spinner, Paragraph } from "grommet";

export default function Loading() {
  return (
    <Box flex align="center" justify="center">
      <Spinner />
      <Paragraph>Loading...</Paragraph>
    </Box>
  );
}
