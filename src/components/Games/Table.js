import { Heading, Box, Button, DropButton, Paragraph } from 'grommet';
import { deleteTable, leaveTeam, startMatch } from '../../service/Games';
import { auth, db } from '../../config/firebase-config';
import { useState, useEffect, useRef, useCallback } from 'react';
import Loading from '../Loading';
import {
	PlayFill,
	StopFill,
	Run,
	Trash,
	MoreVertical,
	Add
} from 'grommet-icons';
import Team from './Team';
import ResultClaim from './ResultClaim';

export default function Table(props) {
	const [loading, setLoading] = useState(false);
	const [teamOne, setTeamOne] = useState([]);
	const [teamTwo, setTeamTwo] = useState([]);
	const [currentTeam, setCurrentTeam] = useState(null);
	const [resultClaimState, setResultClaimState] = useState(false);
	const timerEl = useRef();
	const timerInterval = useRef();

	const difference = props.endedAt - props.matchInProgress;
	const minutes = Math.floor(difference / 60000);
	const seconds = ((difference % 60000) / 1000).toFixed(0);

	const handleGetTeamOne = useCallback(() => {
		console.log('GETTING TEAM 1');
		setTeamOne([]);
		db.collection('games')
			.doc(props.table.id)
			.collection('teams')
			.doc('team1')
			.collection('members')
			.onSnapshot(async (snapshot) => {
				const memberCount = snapshot.docs.length;
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
								setTeamOne(newMembers);
								setLoading(false);
							}
						});
				});
			});

		db.collection('games')
			.doc(props.table.id)
			.collection('teams')
			.doc('team1')
			.collection('members')
			.doc(auth.currentUser.uid)
			.onSnapshot((doc) => {
				if (doc.exists) {
					setCurrentTeam('team1');
				}
			});
	}, [props.table]);

	const handleGetTeamTwo = useCallback(() => {
		console.log('GETTING TEAM 2');
		setTeamTwo([]);
		db.collection('games')
			.doc(props.table.id)
			.collection('teams')
			.doc('team2')
			.collection('members')
			.onSnapshot(async (snapshot) => {
				const memberCount = snapshot.docs.length;
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
								setTeamTwo(newMembers);
								setLoading(false);
							}
						});
				});
			});

		db.collection('games')
			.doc(props.table.id)
			.collection('teams')
			.doc('team2')
			.collection('members')
			.doc(auth.currentUser.uid)
			.onSnapshot((doc) => {
				if (doc.exists) {
					setCurrentTeam('team2');
				}
			});
	}, [props.table]);

	const timer = useCallback(() => {
		console.log(props.endedAt);
		if (!timerEl.current) {
			return;
		}
		const timeStamp = props.endedAt || new Date().getTime();
		const diff = timeStamp - props.matchInProgress;
		const min = Math.floor(diff / 60000);
		const sec = ((diff % 60000) / 1000).toFixed(0);
		timerEl.current.innerHTML = min + ':' + (sec < 10 ? '0' : '') + sec;
	}, [props.endedAt, props.matchInProgress]);

	useEffect(() => {
		if (!props.matchInProgress) {
			return;
		}
		setLoading(true);

		handleGetTeamOne();
		handleGetTeamTwo();

		if (props.endedAt) {
			const difference = props.endedAt - props.matchInProgress;
			const minutes = Math.floor(difference / 60000);
			const seconds = ((difference % 60000) / 1000).toFixed(0);
			console.log(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
		}

		if (props.matchInProgress && !props.endedAt) {
			timerInterval.current = setInterval(timer, 1000);
		}

		return () => clearInterval(timerInterval);
	}, [props.matchInProgress, props.endedAt]);

	useEffect(() => {
		setLoading(true);
		handleGetTeamOne();
		handleGetTeamTwo();
	}, [handleGetTeamOne, handleGetTeamTwo, currentTeam]);

	console.log(props.index, minutes + ':' + (seconds < 10 ? '0' : '') + seconds);

	if (loading) {
		<Loading />;
	}
	return (
		<Box
			flex
			direction="column"
			key={props.index}
			align="center"
			width="100%"
			className={props.endedAt ? 'game-table ended' : 'game-table'}
			background="status-disabled"
		>
			{resultClaimState && (
				<ResultClaim
					show={resultClaimState}
					oops={() => setResultClaimState(false)}
					roomCode={props.roomCode}
					claimTime={timerEl.current.innerHTML}
					gameUid={props.table.id}
					matchInProgress={props.matchInProgress}
					currentTeam={currentTeam}
					table={props.table.id}
					teams={{
						team1: teamOne.map((member) => member),
						team2: teamTwo.map((member) => member)
					}}
				/>
			)}

			<Box
				flex="shrink"
				fill="horizontal"
				align="center"
				pad="0px 1.5em"
				justify="between"
				direction="row"
				margin={{ bottom: '1em' }}
			>
				<Heading level="2">Game {props.index + 1}</Heading>
				{!props.endedAt ? (
					<Heading ref={timerEl}></Heading>
				) : (
					<Heading className="game-time-total">
						{minutes + ':' + (seconds < 10 ? '0' : '') + seconds}
					</Heading>
				)}
				{currentTeam !== null && (
					<DropButton
						size="small"
						icon={<MoreVertical color="brand" size="medium" />}
						dropAlign={{ top: 'bottom', right: 'right' }}
						dropContent={
							<Box pad=".5em" background="light-2" fill>
								{currentTeam !== null && (
									<>
										<Button
											primary
											margin=".5em 0px"
											color="status-critical"
											gap="xxsmall"
											label="Leave"
											onClick={() => {
												setCurrentTeam(null);
												leaveTeam(
													auth.currentUser.uid,
													props.table.id,
													currentTeam
												);
											}}
											icon={<Run size="medium" />}
										/>
										<Button
											margin=".5em 0px"
											primary
											label="Delete Table"
											color="status-error"
											gap="xxsmall"
											onClick={() =>
												deleteTable(props.roomCode, props.table.id)
											}
											icon={<Trash size="medium" />}
										/>
									</>
								)}

								{props.matchInProgress && (
									<Button
										margin=".5em 0px"
										primary
										label="Call Next"
										color="status-info"
										gap="xxsmall"
										onClick={() => deleteTable(props.roomCode, props.table.id)}
										icon={<Add size="medium" />}
									/>
								)}
							</Box>
						}
					/>
				)}
			</Box>
			<Box
				flex
				fill
				direction={props.endedAt ? 'row' : 'column'}
				align="center"
				justify="between"
			>
				{currentTeam === 'team2' && teamOne.length === 0 ? (
					<Box flex fill align="center" justify="center">
						<Paragraph>Waiting for opponent...</Paragraph>
					</Box>
				) : (
					<Box
						fill
						flex
						direction="row"
						align="center"
						className={
							props.winnerId === 'team1'
								? 'team-container winner'
								: 'team-container'
						}
					>
						<Team
							team={teamOne}
							currentTeam={currentTeam}
							table={props.table.id}
							teamId="team1"
							winnerId={props.winnerId}
							matchInProgress={props.matchInProgress}
						/>
						{/* {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team1"}
                table={props.table.id}
                matchInProgress={props.matchInProgress}
              />
            )} */}
					</Box>
				)}
				{currentTeam && !props.matchInProgress && !props.endedAt && (
					<Button
						label="Start Match"
						primary
						color="#1aa358"
						icon={<PlayFill />}
						onClick={() => startMatch(props.roomCode, props.table.id)}
						disabled={teamOne.length === 0 || teamTwo.length === 0}
					/>
				)}
				{currentTeam && props.matchInProgress && !props.endedAt && (
					<Button
						label="End Match"
						primary
						color="#FF4040"
						icon={<StopFill />}
						onClick={() => setResultClaimState(true)}
						disabled={!currentTeam && !props.matchInProgress}
					/>
				)}
				{!currentTeam && !props.matchInProgress && (
					<Heading level="1">VS</Heading>
				)}
				{currentTeam === 'team1' && teamTwo.length === 0 ? (
					<Box flex fill align="center" justify="center">
						<Paragraph>Waiting for opponent...</Paragraph>
					</Box>
				) : (
					<Box
						fill
						flex
						direction="row"
						align="center"
						className={
							props.winnerId === 'team2'
								? 'team-container winner'
								: 'team-container'
						}
					>
						<Team
							team={teamTwo}
							currentTeam={currentTeam}
							table={props.table.id}
							teamId="team2"
							winnerId={props.winnerId}
							matchInProgress={props.matchInProgress}
						/>
						{/* {currentMatch !== null && props.matchInProgress && (
              <Rack
                currentTeam={currentTeam}
                isUserPlaying={isUserPlaying}
                currentMatch={currentMatch}
                roomCode={props.roomCode}
                teamId={"team2"}
                table={props.table.id}
                matchInProgress={props.matchInProgress}
              />
            )} */}
					</Box>
				)}
			</Box>
		</Box>
	);
}
