import { Box, Avatar, Stack } from 'grommet';
import { FormView } from 'grommet-icons';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import { getProfileImageUrl } from './../../service/Users';
import { Heading } from 'grommet';
import { db, auth } from './../../config/firebase-config';

export default function TeamMember(props) {
	const [avatarUrl, setAvatarURL] = useState();
	const [loading, setLoading] = useState(false);
	const [ userGameData, setUserGameData ] = useState();

	useEffect(() => {
		setLoading(true);
		db.collection('games')
			.doc(props.table)
			.collection('teams')
			.doc(props.teamId)
			.collection('members')
			.doc(props.member.id)
			.get()
			.then((user) =>
			{
				setUserGameData(user.data())
			});
		getProfileImageUrl(props.member.id)
			.then((url) => {
				setAvatarURL(url);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}, [ props.member.id, props.table, props.teamId ]);

	console.log(props.table, userGameData)

	return (
		<Box
			flex="grow"
			width={props.matchInProgress ? '100%' : '50%'}
			key={props.index}
			direction="row"
			align="center"
			justify="between"
		>
			<Box flex direction='column' align="center" justify='center'>
			{!loading ? (
					<Stack anchor="top-right">
						<Avatar
							margin=".5em 0px"
							src={ avatarUrl }
							background="brand"
							size="medium"
						>
							{ props.member.data.name[ 0 ] }
						</Avatar>
						{ userGameData && userGameData.eyeToEye === 'Yes' && (
							<Box background="#fff" pad=".05em" round="50%" className="stack">
								<FormView color="brand" />
							</Box>
						) }
					</Stack>
			) : (
				<Loading />
			)}
				<Heading level="4" margin="0px">{ props.member.data.name }</Heading>
			</Box>
			{ userGameData && userGameData.statsReported && (
				<Box flex direction='column' align='center'>
					<Heading level="4" margin="0px">Redemption</Heading>
					<Heading level="3" margin="0px">× { userGameData.redemptionCount || 0 }</Heading>
				</Box>
			) }

		</Box>
	);
}
