import { Box, TextInput, Button, Heading, Form } from 'grommet';
import { Bar, Aggregate, Run } from 'grommet-icons';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import ProfileCard from '../../components/ProfileCard';
import { auth, db } from '../../config/firebase-config';
import {
	createRoom,
	getUserActiveRoom,
	joinRoom,
	leaveRoom
} from '../../service/Rooms';

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [room, setRoom] = useState(null);
	const [codeValue, setCodeValue] = useState(null);
	const [members, setMembers] = useState([]);

	async function handleCreateRoom() {
		setLoading(true);
		await createRoom(auth.currentUser.uid);
		getUserActiveRoom(auth.currentUser.uid).then((room) => {
			setRoom(room);
			setLoading(false);
		});
	}

	async function handleJoinRoom() {
		if (!codeValue) {
			return;
		}
		setLoading(true);
		await joinRoom(auth.currentUser.uid, codeValue);
		getUserActiveRoom(auth.currentUser.uid).then((room) => {
			setRoom(room);
			setCodeValue(null);
			setLoading(false);
		});
		setLoading(false);
	}

	async function handleLeaveRoom() {
		setLoading(true);
		await leaveRoom(auth.currentUser.uid);
		setRoom(null);
		setLoading(false);
	}

	useEffect(() => {
		if (members.length === 0) {
			getUserActiveRoom(auth.currentUser.uid).then((room) => {
				setRoom(room);
				setCodeValue(null);
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
			.limit(25)
			.onSnapshot((snapshot) => {
				setMembers(snapshot.docs.map((doc) => doc.data()));
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

	if (loading) {
		return <Loading />;
	}

	console.log(members);

	if (room && members) {
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
					{members &&
						members.map((member) => (
							<ProfileCard
								key={member.uid}
								uid={member.uid}
								name={member.name}
								homeOwner={member.uid === room.roomOwner.uid ? true : false}
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
							onChange={(event) =>
								setCodeValue(event.target.value.toUpperCase())
							}
						/>
						<Button
							margin=".5em 0px"
							primary
							type="submit"
							size="large"
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
