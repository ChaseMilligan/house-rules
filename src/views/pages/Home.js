import { Box } from "grommet";
import { auth } from "../../config/firebase-config";

export default function Home() {
  return (
    <Box flex align="center" justify="center">
      <h1>Home</h1>
      <Box flex align="center" justify="center">
        {auth.currentUser ? (
          <p>Signed in as: {auth.currentUser.displayName}</p>
        ) : (
          <p>You are not Logged in.</p>
        )}
      </Box>
    </Box>
  );
}
