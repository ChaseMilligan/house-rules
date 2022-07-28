import { Box, Avatar } from 'grommet';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import { getProfileImageUrl } from './../../service/Users';

export default function TeamMember(props) {
	const [avatarUrl, setAvatarURL] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getProfileImageUrl(props.member.id).then((url) => {
			setAvatarURL(url);
			setLoading(false);
		})
			.catch((err) =>
			{
			setLoading(false);
		});
	}, [ props.member.id ]);

	console.log(props.member)

	return (
		<Box
			flex="grow"
			width={props.matchInProgress ? '100%' : '50%'}
			key={props.index}
			direction="column"
			align="center"
			justify="center"
		>
			<p>{props.winnerId === props.teamId ? 'Winner!' : ' '}</p>
			{!loading ? (
				<Avatar
					margin=".5em 0px"
					src={avatarUrl}
					background="brand"
					size="medium"
				>
					{props.member.data.name[0]}
				</Avatar>
			) : (
				<Loading />
			)}
			<p style={{ marginTop: '.25em' }}>{props.member.data.name}</p>
		</Box>
	);
}
