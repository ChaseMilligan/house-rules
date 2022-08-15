import { Box, Button, Heading, Layer, RadioButtonGroup } from 'grommet';
import { Add, Subtract, LinkPrevious } from 'grommet-icons';
import { useState } from 'react';
import Rack from './Rack';

export default function ReportStats(props) {
	const [currentRackScore, setCurrentRackScore] = useState([]);
	const [eyeToEye, setEyeToEye] = useState('No');
	const [redemptionCount, setRedemptionCount] = useState(0);

	console.log(currentRackScore);

	function handleClick(cup) {
		console.log(cup);
		if (currentRackScore.includes(cup)) {
			setCurrentRackScore(currentRackScore.filter((item) => item !== cup));
		} else {
			setCurrentRackScore([...currentRackScore, cup]);
		}
	}

	function handleReportSubmit() {
		console.log(currentRackScore, eyeToEye, redemptionCount);
	}

	return (
		<Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
			<Box overflow="scroll" pad="2em" height="100%">
				<Box margin="2em 0px">
					<LinkPrevious color="dark-6" onClick={props.onModalClose} />
				</Box>
				<Box
					flex
					margin={{ bottom: '2em' }}
					align="start"
					justify="start"
					overflow="scroll"
				>
					<Heading level="2">Hit Eye to Eye</Heading>
					<RadioButtonGroup
						name="doc"
						options={['Yes', 'No']}
						value={eyeToEye}
						onChange={(event) => setEyeToEye(event.target.value)}
					/>
					<Heading level="2">Regulation Cups Hit</Heading>
					<Rack currentScore={currentRackScore} setCurrentScore={handleClick} />
					<Heading level="2">Redemption Shots Hit</Heading>
					<Box
						flex
						direction="row"
						align="center"
						justify="between"
						width="100%"
					>
						<Button
							icon={<Subtract size="medium" />}
							label="1"
							color="status-error"
							disabled={redemptionCount === 0}
							onClick={() => {
								if (redemptionCount > 0) {
									setRedemptionCount(redemptionCount - 1);
								}
							}}
						></Button>
						<Heading level="1" margin="0px">
							{redemptionCount}
						</Heading>
						<Button
							icon={<Add size="medium" />}
							color="#1aa358"
							label="1"
							onClick={() => {
								setRedemptionCount(redemptionCount + 1);
							}}
						/>
					</Box>
				</Box>
				<Button
					primary
					color="#1aa358"
					label="Submit"
					width="100%"
					onClick={() => handleReportSubmit()}
				/>
			</Box>
		</Layer>
	);
}
