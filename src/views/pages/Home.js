import { Box, TextInput, Button, Heading } from "grommet";
import { Bar, Aggregate, Run } from "grommet-icons";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import ProfileCard from "../../components/ProfileCard";
import { auth } from "../../config/firebase-config";
import { getRndInteger } from "../../scripts/helpers";
import {
  createRoom,
  getUserActiveRoom,
  joinRoom,
  leaveRoom,
} from "../../service/Rooms";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [codeValue, setCodeValue] = useState(null);

  async function handleCreateRoom() {
    setLoading(true);
    await createRoom(auth.currentUser.uid);
    getUserActiveRoom(auth.currentUser.uid).then((room) => {
      setRoom(room);
      setLoading(false);
    });
  }

  async function handleJoinRoom() {
    setLoading(true);
    await joinRoom(auth.currentUser.uid, codeValue);
    getUserActiveRoom(auth.currentUser.uid).then((room) => {
      setRoom(room);
      setLoading(false);
    });
    setLoading(false);
  }

  async function handleLeaveRoom() {
    setLoading(true);
    await leaveRoom(auth.currentUser.uid);
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
        setRoom(room);
      }
      setLoading(false);
    });
  }, []);

  console.log(room);

  if (loading) {
    return <Loading />;
  }

  if (room !== null) {
    return (
      <Box fill flex align="center" justify="start">
        <h2>{room.uid}</h2>
        <Button
          size="small"
          label="Leave Party"
          icon={<Run />}
          onClick={handleLeaveRoom}
        />
        <div className="container-fluid">
          {room.members.map((member) => (
            <ProfileCard
              name={member.name}
              winLoss={getRndInteger(35, 65)}
              homeOwner={member.uid === room.uid ? true : false}
            />
          ))}
        </div>
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
