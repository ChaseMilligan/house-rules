import {
	Box,
	Button,
	Heading,
	Layer,
	Paragraph,
	Form,
	FormField,
	TextInput
} from 'grommet';
import { LinkPrevious, Trash, Add, Drag } from 'grommet-icons';
import { useState } from 'react';
import { auth } from '../../config/firebase-config';
import { overwriteRules } from '../../service/Rules';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ConfirmationModal from '../ConfirmationModal';

export default function RuleSetModal(props) {
	const [rules, setRules] = useState(props.ruleSet.rules.rules || []);
	const [value, setValue] = useState();
	const [ruleSetName] = useState(props.ruleSet.name);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [confirmationText, setConfirmationText] = useState('Are you sure?');
	const [confirmationFunction, setConfirmationFunction] = useState();
	const [confirmationFunctionProps, setConfirmationFunctionProps] = useState();
	const [confirmSubmitColor, setConfirmSubmitColor] = useState('brand');
	const [confirmSubmitText, setConfirmSubmitText] = useState('Submit');

	async function handleDeleteRule(rule) {
		const filteredRules = rules.filter((item) => item !== rule);
		await overwriteRules(auth.currentUser.uid, ruleSetName, filteredRules);
		setRules(filteredRules);
	}

	async function handleAddRule({ value }) {
		console.log(value);
		const newRules = [...rules, value.rule];
		await overwriteRules(auth.currentUser.uid, ruleSetName, newRules);
		setValue('');
		setRules(newRules);
	}

	function handleDragEnd(props) {
		const destinationIndex = props[0].destination.index;
		const sourceIndex = props[0].source.index;
		let newRules = rules;

		console.log(destinationIndex, sourceIndex);

		if (destinationIndex >= newRules.length) {
			var k = destinationIndex - newRules.length + 1;
			while (k--) {
				newRules.push(undefined);
			}
		}
		newRules.splice(destinationIndex, 0, newRules.splice(sourceIndex, 1)[0]);
		overwriteRules(auth.currentUser.uid, ruleSetName, newRules);
	}

	function handleDeleteRuleSet() {
		props.handleDeleteRuleSet(props.ruleSet);
	}

	return (
		<Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
			<ConfirmationModal
				showing={showConfirmationModal}
				onModalClose={() => setShowConfirmationModal(false)}
				confirmationText={confirmationText}
				confirmationFunction={confirmationFunction}
				confirmationFunctionProps={confirmationFunctionProps}
				confirmSubmitColor={confirmSubmitColor}
				confirmSubmitText={confirmSubmitText}
			/>
			<Box overflow="scroll" padding="0px 1em">
				<Box margin="2em 2em" flex="grow" direction="row" align="center">
					<LinkPrevious color="dark-6" onClick={props.onModalClose} />
					<Heading margin="0px .5em" level="2">
						{ruleSetName}
					</Heading>
				</Box>
				<Box pad="0px 2em">
					{props.canEdit && (
						<Form
							value={value}
							onChange={(nextValue) => setValue(nextValue)}
							onReset={() => setValue()}
							onSubmit={handleAddRule}
						>
							<Box flex="grow" direction="row" align="end" justify="between">
								<FormField name="rule" htmlFor="rule" label="New Rule">
									<TextInput
										name="rule"
										id="rule"
										placeholder="Enter Rule Here..."
										value={value}
									/>
								</FormField>
								<Button type="submit" label="" icon={<Add />} />
							</Box>
						</Form>
					)}
					<DragDropContext onDragEnd={(...props) => handleDragEnd(props)}>
						<Droppable droppableId="drop-1">
							{(provided) => (
								<div
									className="drag-container"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{rules &&
										rules.map((rule, index) => (
											<Draggable
												key={index}
												draggableId={'drag-' + index}
												index={index}
											>
												{(provided, snapshot) => (
													<Box
														key={index}
														flex="grow"
														className={
															snapshot.isDragging
																? 'rule-item is-dragging'
																: 'rule-item'
														}
														style={{
															...provided.draggableProps.style
														}}
														margin={{ bottom: '1em' }}
														background="light-2"
														ref={provided.innerRef}
														{...provided.draggableProps}
													>
														<Box
															flex
															direction="row"
															align="center"
															justify="between"
														>
															<Box
																flex
																direction="row"
																align="center"
																justify="start"
															>
																{props.canEdit && (
																	<div {...provided.dragHandleProps}>
																		<Drag />
																	</div>
																)}
																<Heading
																	level="2"
																	style={{ padding: '0px' }}
																	margin={{
																		left: '1em',
																		top: '0px',
																		bottom: '0px'
																	}}
																>
																	{index + 1}.
																</Heading>
															</Box>
															{props.canEdit && (
																<Button
																	size="large"
																	icon={<Trash color="status-critical" />}
																	onClick={() => {
																		setConfirmSubmitText('Delete');
																		setConfirmSubmitColor('status-error');
																		setConfirmationText(
																			'Are you sure you want to DELETE this Rule?'
																		);
																		setConfirmationFunctionProps(rule);
																		setConfirmationFunction(() => {
																			return handleDeleteRule;
																		});
																		setShowConfirmationModal(true);
																	}}
																/>
															)}
														</Box>
														<Paragraph>{rule}</Paragraph>
													</Box>
												)}
											</Draggable>
										))}
								</div>
							)}
						</Droppable>
					</DragDropContext>
					<Box flex="grow" margin=".5em 0px" pad="1em 0em">
						{props.canEdit && (
							<Button
								margin=".5em 0px"
								primary
								size="medium"
								color="status-critical"
								label="Delete Rule Set"
								icon={<Trash />}
								onClick={() => {
									setConfirmSubmitText('Delete');
									setConfirmSubmitColor('status-error');
									setConfirmationText(
										'Are you sure you want to DELETE this Rule Set?'
									);
									setConfirmationFunction(() => {
										return handleDeleteRuleSet;
									});
									setShowConfirmationModal(true);
								}}
							/>
						)}
					</Box>
				</Box>
			</Box>
		</Layer>
	);
}
