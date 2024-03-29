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
import ReportStats from './ReportStats';
import ConfirmationModal from '../ConfirmationModal';

export default function Table(props) {
	const [loading, setLoading] = useState(false);
	const [teamOne, setTeamOne] = useState([]);
	const [teamTwo, setTeamTwo] = useState([]);
	const [currentTeam, setCurrentTeam] = useState(null);
	const [resultClaimState, setResultClaimState] = useState(false);
	const [statsTracked, setStatsTracked] = useState(false);
	const [showStatReport, setShowStatReport] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [confirmationText, setConfirmationText] = useState('Are you sure?');
	const [confirmationFunction, setConfirmationFunction] = useState();
	const [confirmationFunctionProps, setConfirmationFunctionProps] = useState();
	const [confirmSubmitColor, setConfirmSubmitColor] = useState('brand');
	const [confirmSubmitText, setConfirmSubmitText] = useState('Submit');

	const timerEl = useRef();
	const timerInterval = useRef();

	const difference = props.endedAt - props.matchInProgress;
	const minutes = Math.floor(difference / 60000);
	const seconds = ((difference % 60000) / 1000).toFixed(0);

	const handleGetTeamOne = useCallback(() => {
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

	function onModalClose() {
		setShowStatReport(false);
	}

	function handleLeaveTeam() {
		setCurrentTeam(null);
		leaveTeam(auth.currentUser.uid, props.table.id, currentTeam);
	}

	function handleDeleteGame() {
		deleteTable(props.roomCode, props.table.id);
	}

	useEffect(() => {
		if (!props.matchInProgress) {
			return;
		}
		setResultClaimState(false);
		setLoading(true);

		handleGetTeamOne();
		handleGetTeamTwo();

		if (props.matchInProgress && !props.endedAt) {
			timerInterval.current = setInterval(timer, 1000);
		}

		return () => clearInterval(timerInterval);
	}, [props.matchInProgress, props.endedAt]);

	useEffect(() => {
		setLoading(true);
		handleGetTeamOne();
		handleGetTeamTwo();
		if (currentTeam) {
			db.collection('games')
				.doc(props.table.id)
				.collection('teams')
				.doc(currentTeam)
				.collection('members')
				.doc(auth.currentUser.uid)
				.get()
				.then((user) => {
					if (user.data().statsReported) {
						setStatsTracked(true);
					}
				});
		}
	}, [handleGetTeamOne, handleGetTeamTwo, currentTeam]);

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
			<ConfirmationModal
				showing={showConfirmationModal}
				onModalClose={() => setShowConfirmationModal(false)}
				confirmationText={confirmationText}
				confirmationFunction={confirmationFunction}
				confirmationFunctionProps={confirmationFunctionProps}
				confirmSubmitColor={confirmSubmitColor}
				confirmSubmitText={confirmSubmitText}
			/>
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

			{showStatReport && (
				<ReportStats
					onModalClose={onModalClose}
					game={props.table}
					currentTeam={currentTeam}
					roomCode={props.roomCode}
				/>
			)}

			<Box
				flex="shrink"
				fill="horizontal"
				align="center"
				pad=".5em"
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
								{!props.table.data.matchInProgress && (
									<>
										<Button
											primary
											margin=".5em 0px"
											gap="xxsmall"
											label="Leave"
											onClick={() => {
												setConfirmSubmitText('Leave');
												setConfirmSubmitColor('status-error');
												setConfirmationText(
													'Are you sure you want to LEAVE this game?'
												);
												setConfirmationFunction(() => {
													return handleLeaveTeam;
												});
												setShowConfirmationModal(true);
											}}
											icon={<Run size="medium" />}
										/>
										<Button
											margin=".5em 0px"
											primary
											label="Delete Game"
											color="status-error"
											gap="xxsmall"
											onClick={() => {
												setConfirmSubmitText('Delete');
												setConfirmSubmitColor('status-error');
												setConfirmationText(
													'Are you sure you want to DELETE this game?'
												);
												setConfirmationFunction(() => {
													return handleDeleteGame;
												});
												setShowConfirmationModal(true);
											}}
											icon={<Trash size="medium" />}
										/>
									</>
								)}
								{props.endedAt && !statsTracked && (
									<Button
										margin=".5em 0px"
										primary
										label="Report Stats"
										color="status-warning"
										gap="xxsmall"
										onClick={() => setShowStatReport(true)}
									/>
								)}
								<Button
									margin=".5em 0px"
									primary
									label="Flag Opponent"
									color="status-critical"
									gap="xxsmall"
									disabled
									onClick={() => console.log('Report function to come soon :)')}
								/>
							</Box>
						}
					/>
				)}
			</Box>
			<Box pad=".5em" width="100%" flex justify="between">
				{currentTeam === 'team2' && teamOne.length === 0 ? (
					<Box
						margin={{ top: '2em', bottom: '2em' }}
						width="100%"
						align="center"
						justify="center"
					>
						<Paragraph>Waiting for opponent...</Paragraph>
					</Box>
				) : (
					<Box
						width="100%"
						flex={false}
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
					</Box>
				)}
				<Box margin={{ top: '2em', bottom: '2em' }}>
					{currentTeam && !props.matchInProgress && !props.endedAt && (
						<Button
							label="Start Match"
							primary
							color="#1aa358"
							margin={{ top: '.25em', bottom: '.25em' }}
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
						<Heading level="1" style={{ textAlign: 'center' }}>
							VS
						</Heading>
					)}
					{props.endedAt && (
						<Heading level="2" style={{ textAlign: 'center' }}>
							VS
						</Heading>
					)}
				</Box>
				{currentTeam === 'team1' && teamTwo.length === 0 ? (
					<Box
						margin={{ top: '2em', bottom: '2em' }}
						width="100%"
						align="center"
						justify="center"
					>
						<Paragraph>Waiting for opponent...</Paragraph>
					</Box>
				) : (
					<Box
						width="100%"
						flex={false}
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
					</Box>
				)}
			</Box>
		</Box>
	);
}
