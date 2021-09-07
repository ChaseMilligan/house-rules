import { Box, Button, Heading } from "grommet";
import { Add } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getUserByUid } from "../../service/Users";
import {
  createRuleSet,
  deleteRuleSet,
  getUserRuleSets,
} from "../../service/Rules";
import { getUserActiveRoom } from "../../service/Rooms";
import AddModal from "../../components/Rules/AddModal";
import RuleSetList from "../../components/Rules/RuleSetList";

export default function Rules() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [ruleSets, setRuleSets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  async function handleCreateNewSet(name, rules) {
    setLoading(true);
    console.log(name, rules);
    await createRuleSet(auth.currentUser.uid, name, rules);
    const userRuleSets = await getUserRuleSets(auth.currentUser.uid);
    console.log(userRuleSets);
    setRuleSets(userRuleSets);
    setShowAddModal(false);
    setLoading(false);
  }

  async function handleDeleteRuleSet(ruleSet) {
    setLoading(true);
    await deleteRuleSet(auth.currentUser.uid, ruleSet);
    const userRuleSets = await getUserRuleSets(auth.currentUser.uid);
    setRuleSets(userRuleSets);
    setLoading(false);
  }

  function onModalClose() {
    setShowAddModal(false);
  }

  useEffect(async () => {
    setLoading(true);
    const fetchedUser = await getUserByUid(auth.currentUser.uid);
    await getUserActiveRoom(auth.currentUser.uid).then(async (activeRoom) => {
      if (activeRoom) {
        if (auth.currentUser.uid === activeRoom.roomOwner.uid) {
          setCanEdit(true);
        }
        const ownerRuleSets = await getUserRuleSets(activeRoom.roomOwner.uid);
        setRuleSets(ownerRuleSets);
        setRoom(activeRoom);
      } else {
        setCanEdit(true);
        const userRuleSets = await getUserRuleSets(auth.currentUser.uid);
        setRuleSets(userRuleSets);
      }
    });
    setUser(fetchedUser);
    setLoading(false);
  }, []);

  if (loading || user === undefined) {
    return <Loading />;
  }

  console.log(canEdit);

  return (
    <Box flex align="center" justify="start">
      <div className="rules-container container-fluid">
        {user && user.activeRoomUid ? (
          <Box flex align="start" justify="center">
            <Heading level="2">Rules of the House</Heading>
            {ruleSets && ruleSets.length !== 0 && (
              <RuleSetList ruleSets={ruleSets} canEdit={canEdit} />
            )}
          </Box>
        ) : (
          <Box flex align="start" justify="center">
            {showAddModal && (
              <AddModal
                onModalClose={onModalClose}
                onSubmit={handleCreateNewSet}
              />
            )}
            <Box flex fill direction="row" align="center" justify="between">
              <Heading level="2">Your Rule Sets</Heading>
              <Button
                primary
                onClick={() => setShowAddModal(true)}
                size="small"
                gap="xxsmall"
                label="New"
                icon={<Add />}
              />
            </Box>
            {ruleSets && ruleSets.length !== 0 && (
              <RuleSetList
                ruleSets={ruleSets}
                canEdit={canEdit}
                handleDeleteRuleSet={handleDeleteRuleSet}
              />
            )}
          </Box>
        )}
      </div>
    </Box>
  );
}
