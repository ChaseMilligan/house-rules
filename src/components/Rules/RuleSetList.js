import { Box, Button, Heading } from 'grommet';
import update from 'immutability-helper';
import { FormNextLink, Drag } from 'grommet-icons';
import { useState, useCallback, useRef } from 'react';
import RuleSetModal from './RuleSetModal';
import { useDrag, useDrop } from 'react-dnd';
import RuleSet from './RuleSet';

export default function RuleSetList(props) {
	const [ruleSets, setRuleSets] = useState(props.ruleSets);
	const [viewRuleSet, setViewRuleSet] = useState(false);
	const [ruleSet, setRuleSet] = useState();

	const moveCard = useCallback((dragIndex, hoverIndex) => {
		setRuleSets((prevCards) =>
			update(prevCards, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, prevCards[dragIndex]]
				]
			})
		);
	}, []);

	const renderCard = useCallback((ruleSet, index) => {
		return (
			<RuleSet
				key={ruleSet.id}
				index={index}
				id={ruleSet.id}
				text={ruleSet.text}
				ruleSet={ruleSet}
				moveCard={moveCard}
				setRuleSet={setRuleSet}
				canEdit={props.canEdit}
			/>
		);
	}, []);

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
			<div className="drag-container">
				{ruleSets.map((ruleSet, index) => renderCard(ruleSet, index))}
			</div>
		</Box>
	);
}
