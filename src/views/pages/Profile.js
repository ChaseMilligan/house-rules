import {
	Avatar,
	Box,
	Button,
	Heading,
	FileInput,
	Paragraph,
	Meter,
	TextInput
} from 'grommet';
import { Logout, Edit, Checkmark } from 'grommet-icons';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { auth, db } from '../../config/firebase-config';
import {
	changeUserName,
	getProfileImageUrl,
	getUserByUid,
	uploadProfileImage
} from './../../service/Users';
import { percentage } from './../../scripts/helpers';
import GameCard from '../../components/Profile/GameCard';

export default function Profile() {
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(false);
	const [fileToUpload, setFileToUpload] = useState(null);
	const [avatarUrl, setAvatarURL] = useState();
	const [games, setGames] = useState([]);
	const [wins, setWins] = useState([]);
	const [winLoss, setWinLoss] = useState();
	const [meterColor, setMeterColor] = useState('#FFAA15');
	const [avatarUpdated, setAvatarUpdated] = useState(false);
	const [editingName, setEditingName] = useState(false);
	const [currentNameValue, setCurrentNameValue] = useState();
	const [ avatarLoading, setAvatarLoading ] = useState(false);

	function handleSignOut() {
		setLoading(true);
		auth
			.signOut()
			.then((res) => {
				setLoading(false);
				return res;
			})
			.catch((err) => {
				setLoading(false);
				return err;
			});
	}

	function handleUploadNewAvatar() {
		setLoading(true);
		uploadProfileImage(auth.currentUser.uid, fileToUpload)
			.then(() => {
				setFileToUpload();
				setAvatarUpdated(false);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setFileToUpload();
				setAvatarUpdated(false);
				setLoading(false);
			});
	}

	function handleNameChange() {
		setLoading(true);
		changeUserName(auth.currentUser.uid, currentNameValue)
			.then(() => {
				setLoading(false);
				setEditingName(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setEditingName(false);
			});
	}

	useEffect(() => {
		if (winLoss > 52) {
			setMeterColor('#00C781');
		}
		if (winLoss < 48) {
			setMeterColor('#FF4040');
		}
	}, [winLoss]);

	useEffect(() => {
		setWinLoss(percentage(wins.length, games.length));
	}, [games, wins]);

	useEffect(() =>
	{


	}, []);

	useEffect(() => {
		setLoading(true);

		getUserByUid(auth.currentUser.uid).then((data) =>
		{
			setUser(data);
			setCurrentNameValue(data.name);
			setLoading(false);
		});

		setAvatarLoading(true);
		getProfileImageUrl(auth.currentUser.uid).then((url) =>
		{
			setAvatarURL(url);
			setAvatarLoading(false);
		});

		db.collection('users')
			.doc(auth.currentUser.uid)
			.collection('games')
			.onSnapshot((snapshot) =>
			{
				setGames(
					snapshot.docs
						.map((game) => { return { id: game.id, data: game.data() } })
						.filter((item) => item.data.endedAt !== undefined)
				);
				setWins(
					snapshot.docs
						.map((game) =>
						{
							if (game.data().winnerId === game.data().teamId)
							{
								return { id: game.id, data: game.data() };
							} else
							{
								return undefined;
							}
						})
						.filter((item) => item !== undefined)
				);
			});
	}, []);

	console.log(games)

	if (loading) {
		return <Loading />;
	}

	return (
		<Box flex align="center" justify="start" pad="2em">
			{user ? (
				<div className="container-fluid">
					<Box flex align="center" justify="center">
						<Button
							primary
							margin="0px 0px 1em 0px"
							label="Sign Out"
							icon={<Logout />}
							onClick={() => handleSignOut()}
						/>
						<Box
							flex
							align="center"
							justify="center"
							className="edit-avatar-container"
						>
							<Avatar
								margin=".5em 0px"
								src={ avatarUrl }
								background="brand"
								size="5xl"
							>
								{ avatarLoading ? (<Loading />) : (currentNameValue[ 0 ]) }
							</Avatar>
							<FileInput
								className="file-input"
								name="file"
								disabled={ avatarLoading ? true : false }
								onChange={(event) => {
									const fileList = event.target.files;
									console.log(fileList);
									for (let i = 0; i < fileList.length; i += 1) {
										const file = fileList[i];
										setFileToUpload(file);
										setAvatarURL(URL.createObjectURL(file));
										setAvatarUpdated(true);
									}
								}}
							/>
							{!avatarUpdated ? (
								<>
									{ !avatarLoading && (<Edit />) }
								</>
							) : (
								<Checkmark
									className="save"
									color="#fff"
									onClick={() => handleUploadNewAvatar()}
								/>
							)}
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
							{!editingName ? (
								<>
									<Heading margin="0px">{currentNameValue}</Heading>
									<Edit color="#fff" onClick={() => setEditingName(true)} />
								</>
							) : (
								<>
									<TextInput
										name="name"
										id="rule-set-name"
										placeholder="New Rule Set Name..."
										value={currentNameValue}
										onChange={(event) =>
											setCurrentNameValue(event.target.value)
										}
									/>
									<Checkmark
										className="save"
										color="#fff"
										onClick={() => handleNameChange()}
									/>
								</>
							)}
						</Box>
					</Box>
					<Box className='all-time-stats-container' flex direction="column" align="center" justify="around">
						<Paragraph textAlign="center" className='header'>All time stats</Paragraph>
						<Box flex direction="row" align="center" justify="between" width="100%" pad="0px 0px 2em 0px" border={ { side: "bottom", color: '#ccc', size: '4px' } }>
							<Box flex direction="column" align="center" justify="center">
								<Heading margin={ { bottom: '0px' } } level="4">
									Games Played
								</Heading>
								<Paragraph margin={ { top: '.25em' } }>
									{ games.length || 0 }
								</Paragraph>
							</Box>
							{ games.length !== undefined && (
							<div className="profile-card-visuals">
									{ winLoss ? (
									<div className="profile-card-meter">
										<Meter
											size="86px"
											type="circle"
											round
												value={ winLoss }
												color={ meterColor }
										/>
											<Heading level="4">{ winLoss }%</Heading>
									</div>
								) : (
									<></>
									) }
							</div>
							) }

							{ wins !== undefined && (
							<Box flex direction="column" align="center" justify="center">
									<Heading margin={ { bottom: '0px' } } level="4">
									Victories
								</Heading>
									<Paragraph margin={ { top: '.25em' } }>{ wins.length }</Paragraph>
								</Box>
							) }
						</Box>
					</Box>
					<Box width="100%" className='' flex direction="column" align="center" justify="around">
						<Heading margin="1em 0px 0px 0px">Match History</Heading>
						<Paragraph margin="0px 0px 2em 0px" textAlign='center'>Last 20 Matches</Paragraph>
						<Box width="100%" className='' flex direction="column" align="center" justify="around">
							{ games.map((game, index) =>
							{
								if (index <= 20)
								{
									return (
										<GameCard
											key={ index }
											index={ index }
											roomCode={ user.activeRoomUid }
											game={ game.id }
											matchInProgress={ game.data.matchInProgress }
											endedAt={ game.data.endedAt }
											winnerId={ game.data.winnerId } />
									)
								} else
								{
									return
								}
							}) }
						</Box>
					</Box>
				</div>
			) : (
				<p>no user found</p>
			)}
		</Box>
	);
}
