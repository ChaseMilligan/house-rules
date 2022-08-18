import { Avatar, Box, Heading, Meter, Paragraph, Stack, Button } from 'grommet';
import { Home } from 'grommet-icons';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { getProfileImageUrl } from '../service/Users';
import { percentage } from './../scripts/helpers';
import ViewProfileModal from './ViewProfileModal';

export default function ProfileCard(props) {
	const [meterColor, setMeterColor] = useState('#FFAA15');
	const [avatarUrl, setAvatarURL] = useState();
	const [games, setGames] = useState([]);
	const [wins, setWins] = useState([]);
	const [winLoss, setWinLoss] = useState();
	const [showProfileModal, setShowProfileModal] = useState(false);

	function onModalClose() {
		setShowProfileModal(false);
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

	useEffect(() => {
		getProfileImageUrl(props.uid).then((url) => setAvatarURL(url));

		db.collection('users')
			.doc(props.uid)
			.collection('games')
			.onSnapshot((snapshot) => {
				setGames(
					snapshot.docs
						.map((game) => game.data())
						.filter((item) => item.endedAt !== undefined)
				);
				setWins(
					snapshot.docs
						.map((game) => {
							if (game.data().winnerId === game.data().teamId) {
								return game.data();
							} else {
								return undefined;
							}
						})
						.filter((item) => item !== undefined)
				);
			});
	}, [props.uid]);

	console.log(avatarUrl);

	return (
		<div className="profile-card-container">
			{showProfileModal && (
				<ViewProfileModal user={props.member} onModalClose={onModalClose} />
			)}
			<Box flex direction="column" align="center" justify="around">
				<Stack anchor="top-right">
					<Avatar
						src={avatarUrl}
						background="dark-1"
						size={props.size || 'xlarge'}
					>
						{props.name[0]}
					</Avatar>
					{props.homeOwner && (
						<Box background="brand" pad=".5em" round="50%" className="stack">
							<Home color="#0E79B2" />
						</Box>
					)}
				</Stack>
				<Heading level="2">{props.name}</Heading>
			</Box>
			<Box flex direction="row" align="center" justify="around">
				<Box flex direction="column" align="center" justify="center">
					<Heading margin={{ bottom: '0px' }} level="4">
						Games Played
					</Heading>
					<Paragraph margin={{ top: '.25em' }}>{games.length || 0}</Paragraph>
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
					<Box flex direction="column" align="center" justify="center">
						<Heading margin={{ bottom: '0px' }} level="4">
							Victories
						</Heading>
						<Paragraph margin={{ top: '.25em' }}>{wins.length}</Paragraph>
					</Box>
				)}
			</Box>
			<Button
				margin={{ top: '1em' }}
				label="View Profile"
				primary
				onClick={() => setShowProfileModal(true)}
			/>
		</div>
	);
}
