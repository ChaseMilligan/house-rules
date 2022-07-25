import { Box, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { auth, db } from '../../config/firebase-config';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { getUserByUid } from '../../service/Users';
import { createTable, getGameByUid } from '../../service/Games';
import { getUserActiveRoom } from '../../service/Rooms';
import Table from './../../components/Games/Table';

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

				db.collection('rooms')
					.doc(data.activeRoomUid)
					.collection('games')
					.orderBy('createdAt')
					.onSnapshot(async (snapshot) => {
						const gameCount = snapshot.docs.length;
						if (gameCount === 0) {
							setLoading(false);
							return;
						}
						let newTables = [];
						snapshot.docs.forEach((table) => {
							db.collection('games')
								.doc(table.id)
								.onSnapshot((snapshot) => {
									newTables.push({ id: snapshot.id, data: snapshot.data() });
									if (newTables.length === gameCount) {
										setTables(newTables);
										setLoading(false);
									}
								});
						});
					});
			});
		});
	}, []);

	if (loading) {
		return <Loading />;
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
						endedAt={table.data.endedAt}
						winnerId={table.data.winnerId}
					/>
				))}
				<Box style={{ minHeight: '1em' }} flex align="center" justify="start">
					<Button
						margin="1em .0px"
						primary
						size="medium"
						label="Create Game"
						icon={<Add />}
						onClick={() =>
							createTable(user.activeRoomUid, auth.currentUser.uid, user)
						}
					/>
				</Box>
			</div>
		</Box>
	);
}
