import { Box, Button } from 'grommet';
import { endMatch } from '../../service/Games';
import { useState } from 'react';
import Team from './Team';

export default function ResultClaim(props) {
	const [claimWinner, setClaimWinner] = useState();
	const [timeStamp] = useState(new Date().getTime());

	function handleSubmit() {
		endMatch(props.roomCode, props.table, claimWinner, timeStamp);
		props.oops();
	}

	return (
		<Box
			className={props.show ? 'victory-screen show' : 'victory-screen'}
			background="brand"
			flex
			align="center"
			justify="center"
			direction="column"
		>
			<Box
				flex="grow"
				pad="1em"
				fill
				align="center"
				justify="center"
				direction="column"
			>
				<p>Choose the winner</p>
				<Box
					width="100%"
					gap="16px"
					align="center"
					justify="center"
					direction="row"
					margin="32px"
				>
					<Box
						align="center"
						pad="1em"
						fill
						justify="center"
						direction="column"
						className={
							claimWinner === 'team1'
								? 'winner result-team-card'
								: 'result-team-card'
						}
						onClick={() => setClaimWinner('team1')}
					>
						<Team
							team={props.teams.team1}
							currentTeam={props.currentTeam}
							table={props.table}
							teamId="team1"
							matchInProgress={props.matchInProgress}
						/>
					</Box>
					<Box
						align="center"
						pad="1em"
						fill
						justify="center"
						direction="column"
						className={
							claimWinner === 'team2'
								? 'winner result-team-card'
								: 'result-team-card'
						}
						onClick={() => setClaimWinner('team2')}
					>
						<Team
							team={props.teams.team2}
							currentTeam={props.currentTeam}
							table={props.table}
							teamId="team2"
							matchInProgress={props.matchInProgress}
						/>
					</Box>
				</Box>
				<Button
					primary
					color="#1aa358"
					label="Submit"
					margin=".5em"
					disabled={!claimWinner}
					onClick={handleSubmit}
				/>
				<Button primary color="#FF4040" label="Cancel" onClick={props.oops} />
			</Box>
		</Box>
	);
}
