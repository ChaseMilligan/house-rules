import { Box } from 'grommet';

export default function Cup(props) {
	console.log(props.currentScore.includes(1), props.cup);

	return (
		<Box
			onClick={() => props.setCurrentScore(props.cup)}
			background={
				!props.currentScore.includes(props.cup) ? 'status-critical' : 'dark-6'
			}
			className={!props.currentScore.includes(props.cup) ? 'cup' : 'cup hit'}
		/>
	);
}
