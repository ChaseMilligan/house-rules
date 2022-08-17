import { Box, Button, Heading } from 'grommet';
import update from 'immutability-helper';
import { FormNextLink, Drag } from 'grommet-icons';
import { useState, useCallback, useRef } from 'react';
import RuleSetModal from './RuleSetModal';
import { useDrag, useDrop } from 'react-dnd';

export default function RuleSet(props) {
	const ref = useRef(null);
	const [{ handlerId }, drop] = useDrop({
		accept: 'box',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId()
			};
		},
		hover(item, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = props.index;
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}
			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			// Determine mouse position
			const clientOffset = monitor.getClientOffset();
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			// Time to actually perform the action
			console.log(dragIndex, hoverIndex);
			props.moveCard(dragIndex, hoverIndex);
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		}
	});
	const [{ isDragging }, drag] = useDrag({
		type: 'box',
		item: () => {
			return { id: props.id, index: props.index };
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});
	const opacity = isDragging ? 0.7 : 1;

	drag(drop(ref));

	return (
		<Box
			draggable
			className={isDragging ? 'rule-item is-dragging' : 'rule-item'}
			margin={{ bottom: '1em' }}
			background="light-2"
			key={props.index}
			ref={ref}
			style={{ opacity: opacity }}
			data-handler-id={handlerId}
		>
			<Box flex direction="row" align="center" justify="between">
				<Box flex direction="row" align="center" justify="start">
					{props.canEdit && <Drag ref={drag} />}
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
	);
}
