import { Box, Heading, Layer } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import {
	Avatar,
	Button,
	FileInput,
	Paragraph,
	Meter,
	TextInput
} from 'grommet';
import { Logout, Edit, Checkmark } from 'grommet-icons';
import { auth, db } from '../config/firebase-config';
import {
	changeUserName,
	getProfileImageUrl,
	getUserByUid,
	uploadProfileImage
} from '../service/Users';
import GameCard from '../components/Profile/GameCard';
import { percentage } from '../scripts/helpers';

export default function ViewProfileModal(props) {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState();
	const [fileToUpload, setFileToUpload] = useState(null);
	const [avatarUrl, setAvatarURL] = useState();
	const [games, setGames] = useState([]);
	const [wins, setWins] = useState([]);
	const [winLoss, setWinLoss] = useState();
	const [meterColor, setMeterColor] = useState('#FFAA15');
	const [avatarUpdated, setAvatarUpdated] = useState(false);
	const [editingName, setEditingName] = useState(false);
	const [currentNameValue, setCurrentNameValue] = useState();
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [gameData, setGameData] = useState(null);

	useEffect(() => {
		setWinLoss(percentage(wins.length, games.length));
	}, [games, wins]);

	useEffect(() => {
		if (winLoss > 52) {
			setMeterColor('#00C781');
		}
		if (winLoss < 48) {
			setMeterColor('#FF4040');
		}
	}, [winLoss]);

	useEffect(() => {
		setLoading(true);

		getUserByUid(props.user.id).then((data) => {
			setUser(data);
			setCurrentNameValue(data.name);
			setLoading(false);
		});

		setAvatarLoading(true);
		getProfileImageUrl(props.user.id).then((url) => {
			setAvatarURL(url);
			setAvatarLoading(false);
		});

		db.collection('users')
			.doc(props.user.id)
			.collection('games')
			.onSnapshot((snapshot) => {
				setGames(
					snapshot.docs
						.map((game) => {
							db.collection('games')
								.doc(game.id)
								.get()
								.then((item) => {
									console.log(item.data());
									setGameData(item.data());
								});
							return { id: game.id, data: game.data() };
						})
						.filter((item) => item.data.endedAt !== undefined)
						.sort((a, b) => {
							if (a.data.matchInProgress < b.data.matchInProgress) {
								return -1;
							} else {
								return 1;
							}
						})
				);
				setWins(
					snapshot.docs
						.map((game) => {
							if (game.data().winnerId === game.data().teamId) {
								return { id: game.id, data: game.data() };
							} else {
								return undefined;
							}
						})
						.filter((item) => item !== undefined)
				);
			});
	}, []);

	console.log(games, gameData);

	if (loading) {
		return <Loading />;
	}

	return (
		<Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
			<Box overflow="scroll" padding="1em">
				<Box margin="2em" flex="grow" direction="row" align="center">
					<LinkPrevious color="dark-6" onClick={props.onModalClose} />
					<Heading margin="0px .5em" level="2">
						{currentNameValue}'s Profile
					</Heading>
				</Box>
				<Box flex={false} pad="2em">
					{user ? (
						<div>
							<Box flex align="center" justify="center">
								<Box
									flex
									align="center"
									justify="center"
									className="edit-avatar-container"
								>
									<Avatar
										margin=".5em 0px"
										src={avatarUrl}
										background="brand"
										size="5xl"
									>
										{avatarLoading ? <Loading /> : currentNameValue[0]}
									</Avatar>
								</Box>
								<Box
									flex
									direction="row"
									align="center"
									justify="around"
									className="profile-name-container"
									width="100%"
									margin="2em 0px"
								>
									<Heading margin="0px">{currentNameValue}</Heading>
								</Box>
							</Box>
							{games && gameData ? (
								<>
									<Box
										className="all-time-stats-container"
										flex
										direction="column"
										align="center"
										justify="around"
									>
										<Paragraph textAlign="center" className="header">
											All time stats
										</Paragraph>
										<Box
											flex
											direction="row"
											align="center"
											justify="between"
											width="100%"
											pad="0px 0px 2em 0px"
											border={{ side: 'bottom', color: '#ccc', size: '4px' }}
										>
											<Box
												flex
												direction="column"
												align="center"
												justify="center"
											>
												<Heading margin={{ bottom: '0px' }} level="4">
													Games Played
												</Heading>
												<Paragraph margin={{ top: '.25em' }}>
													{games.length || 0}
												</Paragraph>
											</Box>
											{games.length !== undefined && (
												<div className="profile-card-visuals">
													{winLoss ? (
														<div className="profile-card-meter">
															<Meter
																size="86px"
																type="circle"
																round
																value={winLoss}
																color={meterColor}
															/>
															<Heading level="4">{winLoss}%</Heading>
														</div>
													) : (
														<></>
													)}
												</div>
											)}

											{wins !== undefined && (
												<Box
													flex
													direction="column"
													align="center"
													justify="center"
												>
													<Heading margin={{ bottom: '0px' }} level="4">
														Victories
													</Heading>
													<Paragraph margin={{ top: '.25em' }}>
														{wins.length}
													</Paragraph>
												</Box>
											)}
										</Box>
									</Box>
									<Box
										width="100%"
										className=""
										flex
										direction="column"
										align="center"
										justify="around"
									>
										<Heading margin="1em 0px 0px 0px">Match History</Heading>
										<Paragraph margin="0px 0px 2em 0px" textAlign="center">
											Last 20 Matches
										</Paragraph>
										<Box
											width="100%"
											className=""
											flex
											direction="column"
											align="center"
											justify="around"
										>
											{games.reverse().map((game, index) => {
												if (index <= 19) {
													return (
														<GameCard
															key={index}
															index={index}
															roomCode={props.user.data.activeRoomUid}
															game={game}
															gameData={gameData}
															matchInProgress={game.data.matchInProgress}
															endedAt={game.data.endedAt}
															winnerId={game.data.winnerId}
														/>
													);
												} else {
													return;
												}
											})}
										</Box>
									</Box>
								</>
							) : (
								<Paragraph margin="0px 0px 2em 0px" textAlign="center">
									No Game Data Found
								</Paragraph>
							)}
						</div>
					) : (
						<p>no user found</p>
					)}
				</Box>
			</Box>
		</Layer>
	);
}
