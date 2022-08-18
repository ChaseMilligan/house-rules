import { Box, TextInput, Button, Heading, Form } from 'grommet';
import { Bar, Aggregate, Run, UserAdd } from 'grommet-icons';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import ProfileCard from '../../components/ProfileCard';
import QrModal from '../../components/QrModal';
import { auth, db } from '../../config/firebase-config';
import {
	createRoom,
	getUserActiveRoom,
	joinRoom,
	leaveRoom
} from '../../service/Rooms';

export default function Home(props) {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const [loading, setLoading] = useState(false);
	const [room, setRoom] = useState(null);
	const [codeValue, setCodeValue] = useState(params.room || null);
	const [members, setMembers] = useState([]);
	const [showQrModal, setShowQrModal] = useState(false);

	async function handleCreateRoom() {
		setLoading(true);
		await createRoom(auth.currentUser.uid);
		getUserActiveRoom(auth.currentUser.uid)
			.then((room) => {
				setRoom(room);
				props.setUserRoomUid(room);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	function onModalClose() {
		setShowQrModal(false);
	}

	async function handleJoinRoom() {
		if (!codeValue) {
			return;
		}
		setLoading(true);
		await joinRoom(auth.currentUser.uid, codeValue);
		getUserActiveRoom(auth.currentUser.uid)
			.then((room) => {
				setRoom(room);
				props.setUserRoomUid(room);
				setCodeValue(null);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	async function handleLeaveRoom() {
		setLoading(true);
		await leaveRoom(auth.currentUser.uid);
		setRoom(null);
		props.setUserRoomUid('');
		setLoading(false);
	}

	useEffect(() => {
		if (members.length === 0) {
			getUserActiveRoom(auth.currentUser.uid).then((room) => {
				setRoom(room);
				setCodeValue(params.room || null);
				setLoading(false);
			});
		}
	}, [members]);

	useEffect(() => {
		if (!room) {
			return;
		}
		db.collection('rooms')
			.doc(room.uid)
			.collection('members')
			.onSnapshot(async (snapshot) => {
				const memberCount = snapshot.docs.length;
				console.log(snapshot, room);
				if (memberCount === 0) {
					setLoading(false);
					return;
				}
				let newMembers = [];
				snapshot.docs.forEach((member) => {
					db.collection('users')
						.doc(member.id)
						.onSnapshot((snapshot) => {
							newMembers.push({ id: snapshot.id, data: snapshot.data() });
							if (newMembers.length === memberCount) {
								setMembers(newMembers);
								setLoading(false);
							}
						});
				});
			});
	}, [room]);

	useEffect(() => {
		setLoading(true);
		getUserActiveRoom(auth.currentUser.uid).then((room) => {
			if (room) {
				setRoom(room);
			}
			setLoading(false);
		});
	}, []);

	console.log(codeValue);

	if (loading) {
		return <Loading />;
	}

	if (room && members) {
		return (
			<Box fill flex align="center" justify="start">
				{showQrModal && (
					<QrModal onModalClose={onModalClose} roomCode={room.uid} />
				)}
				<Box
					fill
					flex
					direction="row"
					pad="1em"
					align="center"
					justify="around"
				>
					<h2>{room.uid}</h2>
					<Button
						primary
						icon={<UserAdd color="white" />}
						onClick={() => setShowQrModal(true)}
					/>
				</Box>
				<Button
					size="small"
					label="Leave Party"
					icon={<Run />}
					onClick={handleLeaveRoom}
				/>
				<div className="container-fluid">
					{members &&
						members.map((member) => (
							<ProfileCard
								key={member.id}
								uid={member.id}
								name={member.data.name}
								homeOwner={member.id === room.roomOwner.uid ? true : false}
							/>
						))}
				</div>
			</Box>
		);
	}

	return (
		<Box margin="4em 0px" flex align="center" justify="around">
			<Box flex="grow" align="center" justify="around">
				<Form onSubmit={handleJoinRoom}>
					<Box flex="shrink" align="center" justify="center">
						<TextInput
							placeholder="Enter House Code here..."
							value={codeValue}
							style={{
								fontSize: '3em',
								textAlign: 'center',
								fontFamily: 'Staatliches-Regular'
							}}
							onChange={(event) =>
								setCodeValue(event.target.value.toUpperCase())
							}
						/>
						<Button
							margin=".5em 0px"
							primary
							type="submit"
							size="large"
							disabled={!codeValue ? true : false}
							label="Join a Party"
							icon={<Aggregate />}
						/>
					</Box>
				</Form>
				<Heading>Or</Heading>
				<Button
					primary
					size="large"
					label="Start a Party"
					icon={<Bar />}
					onClick={handleCreateRoom}
				/>
			</Box>
		</Box>
	);
}
