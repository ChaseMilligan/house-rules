import { Box, Button } from "grommet";
import { Add } from "grommet-icons";
import { auth, db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getUserByUid } from "../../service/Users";
import { createTable } from "../../service/Games";
import { getUserActiveRoom } from "../../service/Rooms";
import Table from "./../../components/Games/Table";

export default function Games() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [room, setRoom] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    setLoading(true);
    getUserByUid(auth.currentUser.uid).then((data) => {
      setUser(data);
      getUserActiveRoom(auth.currentUser.uid).then((room) => {
        setRoom(room);

        db.collection("rooms")
          .doc(data.activeRoomUid)
          .collection("games")
          .orderBy("createdAt")
          .limit(25)
          .onSnapshot(async (snapshot) => {
            setTables(
              snapshot.docs.map((table) => ({
                id: table.id,
                data: table.data(),
              }))
            );
            setLoading(false);
          });
      });
    });
  }, []);

  if (loading) {
    <Loading />;
  }

  return (
    <Box flex align="center" justify="start" pad="medium">
      <div className="games-container">
        {tables.map((table, index) => (
          <Table
            key={index}
            index={index}
            roomOwner={auth.currentUser.uid === room.roomOwner.uid}
            roomCode={user.activeRoomUid}
            table={table.id}
            matchInProgress={table.data.matchInProgress}
          />
        ))}
        <Box style={{ minHeight: "1em" }} flex align="center" justify="start">
          {room && user && auth.currentUser.uid === room.roomOwner.uid && (
            <Button
              margin="1em .0px"
              primary
              size="medium"
              label="Add Table"
              icon={<Add />}
              onClick={() => createTable(user.activeRoomUid)}
            />
          )}
        </Box>
      </div>
    </Box>
  );
}
