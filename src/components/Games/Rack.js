import { Box } from 'grommet';
import Cup from './Cup';

export default function Rack(props) {
	return (
		<Box
			flex
			direction={'column'}
			align="center"
			justify="center"
			classname="rack"
		>
			<Box width="100%" align="center">
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={1}
				/>
			</Box>
			<Box width="100%" direction="row" align="center" justify="center">
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={2}
				/>
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={3}
				/>
			</Box>

			<Box width="100%" direction="row" align="center" justify="center">
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={4}
				/>
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={5}
				/>
				<Cup
					currentScore={props.currentScore}
					setCurrentScore={props.setCurrentScore}
					cup={6}
				/>
			</Box>
		</Box>
	);
}
