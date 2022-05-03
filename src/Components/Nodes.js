//

import React, { useState, useEffect, useCallback } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import PostList from "./PostList";

import { users, randGen, createText } from "../utils";

const authenticatedUser = users[randGen()];

const allNodesState = atom({
  key: "allNodesState", // unique ID (with respect to other atoms/selectors)
  default: {} // default value (aka initial value)
});
const allUserNodesState = atom({
  key: "allUserNodesState", // unique ID (with respect to other atoms/selectors)
  default: {} // default value (aka initial value)
});
const nodesState = atom({
  key: "nodesState", // unique ID (with respect to other atoms/selectors)
  default: {} // default value (aka initial value)
});
const nodesChangesState = atom({
  key: "nodeChangesState", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});
const userNodeChangesState = atom({
  key: "userNodeChangesState", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});

const Nodes = (props) => {
  // All nodes in the database
  const [allNodes, setAllNodes] = useRecoilState(allNodesState);
  // All userNodes in the database that belong to the authenticatedUser
  const [allUserNodes, setAllUserNodes] = useRecoilState(allUserNodesState);
  // Only visible nodes for authenticatedUser
  const [nodes, setNodes] = useRecoilState(nodesState);
  // All nodes that are changed in the database
  const [nodeChanges, setNodeChanges] = useRecoilState(nodesChangesState);
  // All userNodes in the database that are changed and belong to the authenticatedUser
  const [userNodeChanges, setUserNodeChanges] = useRecoilState(
    userNodeChangesState
  );

  // The input text
  const [value, setValue] = useState("");
  // A flag indicating that all nodes are loaded for the first time and we can continue loading the userNodes.
  const [nodesLoaded, setNodesLoaded] = useState(false);

  {
    // const updateRandomNode = useCallback(async () => {
    //   const nodeIds = Object.keys(allNodes);
    //   const randomNodeId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    //   let nodeRef = db.collection("nodes").doc(randomNodeId);
    //   if (nodeRef.exists) {
    //     await nodeRef.update({
    //       text: createText(),
    //       author: users[randGen()],
    //       upvotesNum: randGen()
    //     });
    //   } else {
    //     nodeRef = db.collection("nodes").doc();
    //     await nodeRef.set({
    //       text: createText(),
    //       author: users[randGen()],
    //       upvotesNum: randGen()
    //     });
    //   }
    // }, [allNodes]);
    // const updateRandomUserNode = useCallback(async () => {
    //   if (allNodes && Object.keys(allNodes).length > 0) {
    //     const nodeIds = Object.keys(allNodes);
    //     const randomNodeId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    //     const randomUser = users[randGen()];
    //     const userNodeDocs = await db
    //       .collection("userNodes")
    //       .where("user", "==", randomUser)
    //       .where("node", "==", randomNodeId)
    //       .limit(1)
    //       .get();
    //     if (userNodeDocs.docs.length > 0) {
    //       const userNodeRef = db
    //         .collection("userNodes")
    //         .doc(userNodeDocs.docs[0].id);
    //       await userNodeRef.update({
    //         upvote: randGen() > 4 ? true : false,
    //         visible: randGen() > 4 ? true : false
    //       });
    //     } else {
    //       const userNodeRef = db.collection("userNodes").doc();
    //       await userNodeRef.set({
    //         node: randomNodeId,
    //         user: randomUser,
    //         upvote: randGen() > 4 ? true : false,
    //         visible: randGen() > 4 ? true : false
    //       });
    //     }
    //   }
    // }, [allNodes]);
    // useEffect(() => {
    //   // Create the query to load the nodes and listen for new ones.
    //   const nodesQuery = db.collection("nodes");
    //   const nodesSnapshot = nodesQuery.onSnapshot(function (snapshot) {
    //     const docChanges = snapshot.docChanges();
    //     if (docChanges.length > 0) {
    //       const nChanges = [];
    //       for (let change of docChanges) {
    //         const nData = change.doc.data();
    //         nChanges.push({
    //           cType: change.type,
    //           nId: change.doc.id,
    //           nData
    //         });
    //       }
    //       setNodeChanges(nChanges);
    //       setNodesLoaded(true);
    //     }
    //   });
    //   // kills snapshot before duplicating it or unmounting component
    //   return () => nodesSnapshot();
    // }, []);
    // useEffect(() => {
    //   if (nodesLoaded) {
    //     // Create the query to load the userNodes and listen for new ones.
    //     const userNodesQuery = db
    //       .collection("userNodes")
    //       .where("user", "==", authenticatedUser);
    //     const userNodesSnapshot = userNodesQuery.onSnapshot(function (snapshot) {
    //       setUserNodeChanges((oldUserNodeChanges) => {
    //         const docChanges = snapshot.docChanges();
    //         // If all nodes are loaded for the first time, we can continue loading the userNodes.
    //         if (docChanges.length > 0) {
    //           for (let change of docChanges) {
    //             // only used for useEffect above
    //             oldUserNodeChanges = [
    //               ...oldUserNodeChanges,
    //               {
    //                 cType: change.type,
    //                 uNodeId: change.doc.id,
    //                 uNodeData: change.doc.data()
    //               }
    //             ];
    //           }
    //         }
    //         return oldUserNodeChanges;
    //       });
    //     });
    //     // kills snapshot before duplicating it or unmounting component
    //     return () => userNodesSnapshot();
    //   }
    // }, [nodesLoaded]);
  }
  const updateRandomNode = useCallback(() => {
    const actionType = Math.random() > 0.5 ? "added" : "modified";
    const nodeIds = Object.keys(allNodes);
    let randomNodeId = Math.floor(Math.random() * 100000000);
    while (actionType === "added" && nodeIds.includes(randomNodeId)) {
      randomNodeId = Math.floor(Math.random() * 100000000);
    }
    const nData = {
      text: createText(),
      author: users[randGen()],
      upvotesNum: randGen()
    };
    setNodeChanges((oldNodeChanges) => [
      ...oldNodeChanges,
      {
        cType: actionType,
        nId: randomNodeId,
        nData
      }
    ]);
  }, [allNodes]);

  const checkUserNodeExists = useCallback(
    (node) => {
      let userNodeExists = false;
      for (let nodeId of Object.keys(allUserNodes)) {
        if (node === nodeId) {
          userNodeExists = allUserNodes[nodeId].userNodeId;
        }
      }
      return userNodeExists;
    },
    [allUserNodes]
  );

  const updateRandomUserNode = useCallback(() => {
    if (nodesLoaded) {
      const nodeIds = Object.keys(allNodes);
      const userNodeIds = Object.keys(allUserNodes);
      const randomNodeId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      const randomUser = users[randGen()];
      const uNodeId = checkUserNodeExists(randomNodeId);
      const actionType = uNodeId ? "modified" : "added";
      const userNodeData = {
        node: randomNodeId,
        user: randomUser,
        upvote: randGen() > 4 ? true : false,
        visible: randGen() > 4 ? true : false
      };
      let randomUserNodeId = Math.floor(Math.random() * 100000000);
      while (actionType === "added" && userNodeIds.includes(randomUserNodeId)) {
        randomUserNodeId = Math.floor(Math.random() * 100000000);
      }
      setUserNodeChanges((oldUserNodeChanges) => [
        ...oldUserNodeChanges,
        {
          cType: actionType,
          uNodeId: uNodeId ? uNodeId : randomUserNodeId,
          uNodeData: userNodeData
        }
      ]);
    }
  }, [allNodes, allUserNodes, checkUserNodeExists, nodesLoaded]);

  useEffect(() => {
    if (Object.keys(allNodes).length >= 25) {
      setNodesLoaded(true);
    }
  }, [allNodes]);

  // To simulate many users' behavior on the database
  useEffect(() => {
    const randomInterval = setInterval(() => {
      if (randGen() > 4) {
        updateRandomUserNode();
      } else {
        updateRandomNode();
      }
    }, 1000);
    return () => clearInterval(randomInterval);
  }, [updateRandomNode, updateRandomUserNode]);

  useEffect(() => {
    let oldAllNodes = { ...allNodes };
    let oldNodes = { ...nodes };
    if (nodeChanges.length > 0) {
      for (let change of nodeChanges) {
        const nodeId = change.nId;
        if (change.cType === "removed") {
          delete oldAllNodes[nodeId];
          if (nodeId in oldNodes) {
            delete oldNodes[nodeId];
          }
        } else {
          let nodeData = change.nData;
          if (change.cType === "added" || !(nodeId in oldAllNodes)) {
            oldAllNodes[nodeId] = {
              ...nodeData
            };
            if (nodeId in allUserNodes) {
              oldAllNodes[nodeId] = {
                ...oldAllNodes[nodeId],
                ...allUserNodes[nodeId]
              };
              if (allUserNodes[nodeId].visible) {
                oldNodes = {
                  ...oldNodes,
                  [nodeId]: { ...oldAllNodes[nodeId] }
                };
              }
            }
          } else if (change.cType === "modified") {
            const node = oldAllNodes[nodeId];
            let isTheSame =
              node.text === nodeData.text &&
              node.upvotesNum === nodeData.upvotesNum &&
              node.author === nodeData.author;
            if (!isTheSame) {
              oldAllNodes[nodeId] = {
                ...node,
                ...nodeData
              };
              if (nodeId in oldNodes) {
                oldNodes = {
                  ...oldNodes,
                  [nodeId]: { ...oldAllNodes[nodeId] }
                };
              }
            }
          }
        }
      }
    }
    const handledUserNodeChangesIds = [];
    let oldAllUserNodes = allUserNodes;
    if (userNodeChanges.length > 0) {
      // object of allUserNodes for the authenticated user in the database (all interactions with every node for the authenticated user)
      // contains all interactions from authenticated user and nodes in the database
      // key: nodeId for userNode
      // value: data for userNode
      let userNodeData;
      // iterating through every change
      for (let userNodeChange of userNodeChanges) {
        // data of the userNode that is changed
        userNodeData = userNodeChange.uNodeData;
        // nodeId of userNode that is changed
        const nodeId = userNodeData.node;
        // if row is removed
        if (userNodeChange.cType === "removed") {
          // if graph includes nodeId, remove it
          if (nodeId in oldNodes) {
            delete oldNodes[nodeId];
          }
          // userNode object is deleted from allUserNodes
          oldAllUserNodes = { ...oldAllUserNodes };
          if (nodeId in oldAllUserNodes) {
            delete oldAllUserNodes[nodeId];
          }
        } else {
          // change can be addition or modification (not removal) of document for the query on userNode table
          // modify change for allUserNodes
          userNodeData = {
            userNodeId: userNodeChange.uNodeId,
            upvote: userNodeData.upvote,
            visible: userNodeData.visible
          };
          if (
            userNodeChange.cType === "added" ||
            userNodeChange.cType === "modified"
          ) {
            // if data for the node is not loaded yet, do nothing
            if (!(nodeId in oldAllNodes)) {
              console.log("Continue");
              continue;
            }
            // if data for the node is loaded
            let uNodeData = {
              // load all data corresponsponding to the node and userNode data from the database and add userNodeId for the change documentation
              ...oldAllNodes[nodeId],
              ...userNodeData
            };
            // if node is not supposed to be visible
            if (!userNodeData.visible) {
              // check if node already exists in authenticated user's map view
              // if user has hidden node with nodeId
              if (oldAllNodes[nodeId].visible && nodeId in oldNodes) {
                delete oldNodes[nodeId];
              }
              // if the node is visible, check every modification
            } else if (
              // left: current state of userNode
              // right: new state of userNode from the database
              // checks whether any userNode attributes on map are different from corresponding userNode attributes from database
              oldAllNodes[nodeId].userNodeId !== userNodeChange.uNodeId ||
              // userNodeData.visible should be already true
              !oldAllNodes[nodeId].visible ||
              oldAllNodes[nodeId].upvote !== userNodeData.upvote
            ) {
              oldNodes[nodeId] = uNodeData;
            }
            oldAllNodes[nodeId] = uNodeData;
          }
          oldAllUserNodes = {
            ...oldAllUserNodes,
            [nodeId]: userNodeData
          };
        }
        handledUserNodeChangesIds.push(userNodeChange.uNodeId);
      }
    }
    if (handledUserNodeChangesIds.length > 0) {
      let oldUserNodeChanges = userNodeChanges;
      oldUserNodeChanges = userNodeChanges.filter(
        (uNObj) => !handledUserNodeChangesIds.includes(uNObj.uNodeId)
      );
      setAllUserNodes(oldAllUserNodes);
      setUserNodeChanges(oldUserNodeChanges);
    }
    if (nodeChanges.length > 0 || handledUserNodeChangesIds.length > 0) {
      setNodes(oldNodes);
      setAllNodes(oldAllNodes);
    }
    if (nodeChanges.length > 0) {
      setNodeChanges([]);
    }
  }, [nodeChanges, userNodeChanges, allNodes, allUserNodes, nodes]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const addNode = useCallback(() => {
    const nodeIds = Object.keys(allNodes);
    const userNodeIds = Object.keys(allUserNodes);
    let randomNodeId = Math.floor(Math.random() * 100000000);
    while (nodeIds.includes(randomNodeId)) {
      randomNodeId = Math.floor(Math.random() * 100000000);
    }
    let randomUserNodeId = Math.floor(Math.random() * 100000000);
    while (userNodeIds.includes(randomUserNodeId)) {
      randomUserNodeId = Math.floor(Math.random() * 100000000);
    }
    setUserNodeChanges((oldUserNodeChanges) => [
      ...oldUserNodeChanges,
      {
        cType: "added",
        uNodeId: randomUserNodeId,
        uNodeData: {
          node: randomNodeId,
          user: authenticatedUser,
          upvote: false,
          visible: true
        }
      }
    ]);
    setTimeout(() => {
      const nData = {
        text: value,
        author: authenticatedUser,
        upvotesNum: 0
      };
      setNodeChanges((oldNodeChanges) => [
        ...oldNodeChanges,
        {
          cType: "added",
          nId: randomNodeId,
          nData
        }
      ]);
    }, 1000);
  }, [value, allNodes, allUserNodes]);

  const vote = useCallback(
    (nId) => {
      setNodeChanges((oldNodeChanges) => [
        ...oldNodeChanges,
        {
          cType: "modified",
          nId: nId,
          nData: {
            text: allNodes[nId].text,
            author: allNodes[nId].author,
            upvotesNum: allNodes[nId].upvotesNum + 1
          }
        }
      ]);
      const uNodeId = checkUserNodeExists(nId);
      if (uNodeId) {
        setUserNodeChanges((oldUserNodeChanges) => [
          ...oldUserNodeChanges,
          {
            cType: "modified",
            uNodeId: uNodeId,
            uNodeData: {
              node: nId,
              user: authenticatedUser,
              upvote: true,
              visible: true
            }
          }
        ]);
      }
    },
    [allNodes]
  );

  const inputstyle = {
    width: "600px",
    border: "1px solid",
    padding: "2px",
    margin: "5px"
  };

  return (
    <div>
      <input value={value} onChange={handleChange} style={inputstyle} />
      <button onClick={addNode} className="btn btn-outline-success">
        Create
      </button>

      <PostList nodes={nodes} vote={vote} />
    </div>
  );
};

export default Nodes;
