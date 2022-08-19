import { Box, Heading, Button } from 'grommet';

export default function ConfirmationModal(props) {
	function handleSubmitClick() {
		props.confirmationFunction(props.confirmationFunctionProps);
		props.onModalClose();
	}

	return (
		<div
			className={
				props.showing
					? 'confirmation-modal-container show'
					: 'confirmation-modal-container'
			}
		>
			<div className="confirmation-content">
				<Heading level="3" style={{ textAlign: 'center' }}>
					{props.confirmationText}
				</Heading>
				<Box flex direction="row" justify="between" align="center">
					<Button
						primary
						margin={{ top: '1em' }}
						label="Cancel"
						onClick={props.onModalClose}
					/>
					<Button
						primary
						margin={{ top: '1em' }}
						label={props.confirmSubmitText}
						color={props.confirmSubmitColor}
						onClick={handleSubmitClick}
					/>
				</Box>
			</div>
		</div>
	);
}
