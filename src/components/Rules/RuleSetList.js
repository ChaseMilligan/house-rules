import { Box, Button, Heading } from 'grommet';
import update from 'immutability-helper';
import { FormNextLink, Drag } from 'grommet-icons';
import { useState, useCallback, useRef } from 'react';
import RuleSetModal from './RuleSetModal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import RuleSet from './RuleSet';

export default function RuleSetList(props) {
	const [ruleSets, setRuleSets] = useState(props.ruleSets);
	const [viewRuleSet, setViewRuleSet] = useState(false);
	const [ruleSet, setRuleSet] = useState();

	return (
		<Box margin="1em 0px" flex fill>
			{viewRuleSet && (
				<RuleSetModal
					canEdit={props.canEdit}
					onModalClose={() => setViewRuleSet(false)}
					ruleSet={ruleSet}
					handleDeleteRuleSet={props.handleDeleteRuleSet}
				/>
			)}
			<DragDropContext
				onDragEnd={(...props) => {
					console.log(props);
				}}
			>
				<Droppable droppableId="drop-1">
					{(provided) => (
						<div
							className="drag-container"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{ruleSets.map((ruleSet, index) => (
								<RuleSet
									key={ruleSet.id}
									index={index}
									id={ruleSet.id}
									text={ruleSet.text}
									ruleSet={ruleSet}
									setRuleSet={setRuleSet}
									canEdit={props.canEdit}
								/>
							))}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</Box>
	);
}
