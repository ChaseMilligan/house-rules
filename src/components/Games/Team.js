import { Box, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { auth } from '../../config/firebase-config';
import { joinTeam } from '../../service/Games';
import { useState } from 'react';
import TeamMember from './TeamMember';
import Loading from '../Loading';

export default function Team(props) {
	const [loading, setLoading] = useState(false);

	console.log(props.team, props.currentTeam)

	if (loading) {
		return <Loading />;
	}

	return (
		<Box
			flex
			fill
			direction={props.matchInProgress ? 'column' : 'row'}
			align={props.teamId === 'team1' ? 'start' : 'end'}
			justify="between"
		>
			{props.team.map((member, index) => (
				<TeamMember
					member={member}
					index={index}
					matchInProgress={props.matchInProgress}
					winnerId={props.winnerId}
					teamId={props.teamId}
					loading={loading}
					setLoading={setLoading}
				/>
			))}
			{!props.currentTeam && !props.matchInProgress && (
				<Box width="50%" flex="grow" direction="column" align="center">
					<Button
						style={{ borderRadius: '50%' }}
						primary
						margin="0px 1em"
						disabled={props.currentTeam !== null}
						icon={<Add />}
						gap="xxsmall"
						onClick={() =>
							joinTeam(auth.currentUser.uid, props.table, props.teamId)
						}
					/>
					<p>Join Team</p>
				</Box>
			)}
		</Box>
	);
}
