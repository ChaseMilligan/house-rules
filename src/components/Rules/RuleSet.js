import { Box, Button, Heading } from 'grommet';
import update from 'immutability-helper';
import { FormNextLink, Drag } from 'grommet-icons';
import { useState, useCallback, useRef } from 'react';
import RuleSetModal from './RuleSetModal';
import { Draggable } from 'react-beautiful-dnd';

export default function RuleSet(props) {
	return (
		<Draggable
			key={props.index}
			draggableId={'drag-' + props.index}
			index={props.index}
		>
			{(provided, snapshot) => (
				<Box
					className={
						snapshot.isDragging ? 'rule-item is-dragging' : 'rule-item'
					}
					style={{
						...provided.draggableProps.style
					}}
					margin={{ bottom: '1em' }}
					background="light-2"
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<Box flex direction="row" align="center" justify="between">
						<Box flex direction="row" align="center" justify="start">
							{props.canEdit && (
								<div {...provided.dragHandleProps}>
									<Drag />
								</div>
							)}
							<Heading level="3" margin={{ left: '1em' }}>
								{props.ruleSet.name}
							</Heading>
						</Box>
						<div>
							<Button
								size="small"
								icon={<FormNextLink color="dark-6" />}
								onClick={() => {
									props.setRuleSet(props.ruleSet);
									props.setViewRuleSet(true);
								}}
							/>
						</div>
					</Box>
				</Box>
			)}
		</Draggable>
	);
}
