import { Box, Button, Heading, Layer, RadioButtonGroup } from 'grommet';
import { Add, Subtract, LinkPrevious } from 'grommet-icons';
import { useState } from 'react';
import { auth } from '../../config/firebase-config';
import { reportStats } from '../../service/Games';
import Loading from '../Loading';
import Rack from './Rack';

export default function ReportStats(props) {
	const [ loading, setLoading ] = useState(false);
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

	async function handleReportSubmit()
	{
		setLoading(true)
		console.log(currentRackScore, eyeToEye, redemptionCount);
		await reportStats(props.roomCode, props.game.id, auth.currentUser.uid, props.currentTeam, currentRackScore, eyeToEye, redemptionCount);

		setLoading(false)
		props.onModalClose()
	}

	if (loading)
	{
		return <Loading />
	}

	return (
		<Layer onEsc={ props.onModalClose } onClickOutside={ props.onModalClose }>
			<Box overflow="scroll" padding="0px 1em">
				<Box margin="1em 1em" flex="grow" direction="row" align="center">
					<LinkPrevious color="dark-6" onClick={props.onModalClose} />
					<Heading margin="0px .5em" level="2">
						Stats Report
					</Heading>
				</Box>
				<Box flex={ false } pad="0px 2em">
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
						margin={ { top: '2em' } }
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
				<Box flex={ false } pad="2em">
					<Button
						margin={ { top: '2em' } }
						pad={ { bottom: '2em' } }
						primary
						color="#1aa358"
						label="Submit"
						width="100%"
						onClick={ () => handleReportSubmit() }
					/>
			</Box>

			</Box>
		</Layer>
	);
}
