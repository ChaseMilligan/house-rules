import { Box, TextInput, Button, Heading, Paragraph } from "grommet";
import { Bar, Aggregate } from "grommet-icons";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { auth } from "../../config/firebase-config";
import { createRoom, getUserActiveRoom, joinRoom } from "../../service/Rooms";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [codeValue, setCodeValue] = useState(null);

  async function handleCreateRoom() {
    setLoading(true);
    await createRoom(auth.currentUser.uid);
    getUserActiveRoom(auth.currentUser.uid).then((room) => {
      console.log(room);
      setRoom(room);
      setLoading(false);
    });
  }

  async function handleJoinRoom() {
    setLoading(true);
    await joinRoom(auth.currentUser.uid, codeValue);
    getUserActiveRoom(auth.currentUser.uid).then((room) => {
      console.log(room);
      setRoom(room);
      setLoading(false);
    });
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getUserActiveRoom(auth.currentUser.uid).then((room) => {
      if (room) {
        console.log(room);
        setRoom(room);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (room !== null) {
    return (
      <Box fill flex align="center" justify="start">
        <h2>{room.code}</h2>
        <Box fill flex align="center" justify="start">
          <h3>Members</h3>
          {room.members.map((member) => (
            <Paragraph>{member.name}</Paragraph>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box margin="4em 0px" flex align="center" justify="around">
      <Box flex="shrink" align="center" justify="center">
        <TextInput
          placeholder="Enter House Code here..."
          value={codeValue}
          onChange={(event) => setCodeValue(event.target.value)}
        />
        <Button
          margin=".5em 0px"
          primary
          size="large"
          label="Join a Party"
          icon={<Aggregate />}
          onClick={handleJoinRoom}
        />
      </Box>
      <Heading>Or</Heading>
      <Button
        primary
        size="large"
        label="Start a Party"
        icon={<Bar />}
        onClick={handleCreateRoom}
      />
    </Box>
  );
}
