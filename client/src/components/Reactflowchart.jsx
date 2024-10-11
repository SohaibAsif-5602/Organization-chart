import React, { useCallback, useEffect, useState } from 'react';
import { HiOutlinePlusSm } from "react-icons/hi";
import './Reactflow.css';
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from '@xyflow/react';
import axios from 'axios';
import Node from './Node.jsx';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import Modal from "./Info.jsx";
import Scalechart from "./BPSscalechart.jsx";

export default function Reactflowchart({ filter }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [data, setData] = useState([]);
  const { fitView, setCenter } = useReactFlow();
  const [clicktimeout, Setclicktimeout] = useState(null);
  const [ismodalvisible, Setismodalvisible] = useState(false);
  const [modaldataid, Setmodaldataid] = useState(null);
  const [childpos, Setchildpos] = useState({ x: 0, y: 0 });
  const [posid, Setposid] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const id = posid;
    const avg = findavgchildpos(id);
    Setchildpos(avg);
  }, [nodes]);

  useEffect(() => {
    if (childpos.x !== 0 && childpos.y !== 0) {
      setCenter(childpos.x + 180, childpos.y - 90, {
        duration: 800,
        zoom: 0.55,
      });
    } else {
      fitView({
        duration: 800,
        padding: 0.8,
        maxZoom: 0.8,
        minZoom: 0.5,
      });
    }
  }, [childpos]);

  const onDoubleclick = (nodeid) => {
    Setismodalvisible(true);
    Setmodaldataid(nodeid);
    if (clicktimeout) {
      clearTimeout(clicktimeout);
      Setclicktimeout(null);
    }
  };

  const onmodalclick = () => {
    Setismodalvisible(false);
    Setmodaldataid(null);
  };

  const onclick = (nodeid) => {
    if (clicktimeout) {
      clearTimeout(clicktimeout);
      Setclicktimeout(null);
    } else {
      const timeout = setTimeout(() => {
        toggleNodeExpansion(nodeid);
        Setclicktimeout(null);
      }, 250);
      Setclicktimeout(timeout);
    }
  };

  const nodecolor = (BPS) => {
    const colors = {
      21: "#FF66B2", 20: '#FF66FF', 19: '#3399FF', 18: '#C0C0C0', 17: '#FFFF44',
      16: '#B2FF44', 15: '#FFB244', 14: '#66B2FF', 13: '#FF6666', 12: '#66FF66',
      11: '#FFCC66', 10: '#FF99FF', 9: '#66FFCC', 8: '#FF9966', 7: '#99FF99',
      6: '#FF6666', 5: '#66CCFF', 4: '#FFCCCC', 3: '#CCFF66', 2: '#FFCC99',
      1: '#FF99CC'
    };
    return colors[BPS] || '#FF474C';
  };

  const hasChildren = (nodeId) => {
    const member = data.find(m => m.id === nodeId);
    return member && member.childrenIds && member.childrenIds.length > 0;
  };

  const initializeDagreLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ nodesep: 250, ranksep: 300 });
    g.setDefaultEdgeLabel(() => ({}));

    data.forEach(member => {
      g.setNode(member.id, { label: member.memberName });
      member.childrenIds.forEach(childId => {
        g.setEdge(member.id, childId);
      });
    });

    dagre.layout(g);
    return g;
  };

  const findavgchildpos = (nodeid) => {
    const member = data.find(m => m.id === nodeid);
    if (member && member.childrenIds.length > 0) {
      const childNodes = member.childrenIds.map(childId => nodes.find(node => node.id === childId)).filter(node => node);
      if (childNodes.length > 0) {
        const totalX = childNodes.reduce((sum, node) => sum + node.position.x, 0);
        const avgX = totalX / childNodes.length;
        const avgY = childNodes[0].position.y;
        return { x: avgX, y: avgY };
      }
    }
    return { x: 0, y: 0 };
  };

  const collapseDescendants = (memberId) => {
    const member = data.find(m => m.id === memberId);
    if (member) {
      member.childrenIds.forEach(childId => {
        setExpandedNodes(prevExpandedNodes => ({
          ...prevExpandedNodes,
          [childId]: false,
        }));
        collapseDescendants(childId);
      });
    }
  };

  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(prevExpandedNodes => {
      const isExpanded = !prevExpandedNodes[nodeId];
      if (!isExpanded) {
        collapseDescendants(nodeId);
      }
      return {
        ...prevExpandedNodes,
        [nodeId]: isExpanded,
      };
    });
  };

  const findRootForFilter = (memberId) => {
    const member = data.find(m => m.id === memberId);
    if (!member) return null;

    // Check if the member belongs to the filter branch
    if (member.Branch === filter) {
      const parent = data.find(m => m.id === member.parentId);
      // If parent doesn't have the same branch, make this member the root
      if (!parent || parent.Branch !== filter) {
        return member.id;
      }
    }

    // Recursively check the children
    if (member.childrenIds) {
      for (const childId of member.childrenIds) {
        const result = findRootForFilter(childId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const getFilteredRootNode = () => {
    if (filter) {
      // Find the root based on the filtering logic
      for (const member of data) {
        const rootCandidate = findRootForFilter(member.id);
        if (rootCandidate) {
          return rootCandidate;
        }
      }
    }

    // If no filter is applied, choose the first node with no parent as the root
    const rootCandidates = data.filter(member => member.parentId === null);
    if (rootCandidates.length > 0) {
      return rootCandidates[0].id;
    }

    // Fallback to the first member in the data if no parentless nodes are found
    return data.length > 0 ? data[0].id : null;
  };

  const isNodeVisible = (memberId) => {
    const rootNodeId = getFilteredRootNode();
    const member = data.find(m => m.id === memberId);
    if (!member) return false;

    if (filter && member.Branch !== filter) {
      return false;
    }

    if (memberId === rootNodeId || member.parentId === null) return true;
    return expandedNodes[member.parentId] && isNodeVisible(member.parentId);
  };

  const generateNodesAndEdges = (g) => {
    const generatedNodes = [];
    const generatedEdges = [];
    const rootNodeId = getFilteredRootNode();
    const childrenByParent = {};

    data.forEach(member => {
      const node = g.node(member.id);
      const isVisible = isNodeVisible(member.id);

      if (isVisible) {
        if (member.parentId && !childrenByParent[member.parentId]) {
          childrenByParent[member.parentId] = [];
        }

        generatedNodes.push({
          id: member.id,
          position: { x: node.x, y: node.y },
          data: {
            label: (
              <div>
                <div style={{ padding: '3.5px' }}>
                  <Node
                    BPS={member.BPS}
                    Designation={member.designation}
                    Branch={member.Branch}
                    image={member.imageLink}
                  />
                </div>
                <div style={{
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  backgroundColor: nodecolor(member.BPS),
                  padding: '0px',
                  borderColor: 'black',
                  borderBottomLeftRadius: expandedNodes[member.id] ? '12px' : '0px',
                  borderBottomRightRadius: expandedNodes[member.id] ? '12px' : '0px',
                }}>
                  <div>{member.memberName}</div>
                </div>
                {hasChildren(member.id) && !expandedNodes[member.id] && (
                  <div style={{
                    backgroundColor: nodecolor(member.BPS),
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                    height: '8px'
                  }}>
                    <HiOutlinePlusSm style={{ fontSize: '2em', backgroundColor: 'white', borderRadius: '15px' }} />
                  </div>
                )}
              </div>
            ),
          },
          style: {
            padding: '0px',
            borderRadius: '12px',
            width: '200px',
            height: 'auto',
          },
          hidden: !isVisible,
        });

        if (expandedNodes[member.id]) {
          member.childrenIds.forEach(childId => {
            if (isNodeVisible(childId)) {
              if (!childrenByParent[member.id]) {
                childrenByParent[member.id] = [];
              }
              childrenByParent[member.id].push(childId);

              generatedEdges.push({
                id: `e${member.id}-${childId}`,
                source: member.id,
                target: childId,
                type: 'default',
                animated: true,
                style: {
                  stroke: '#309e0c',
                  strokeWidth: 5,
                  strokeDasharray: '5,5',
                },
              });
            }
          });
        }
      }
    });

    // Apply sorting logic and gap adjustments for better visualization
    Object.keys(childrenByParent).forEach(parentId => {
      const childrenIds = childrenByParent[parentId];
      const childrenNodes = childrenIds.map(childId => {
        const node = g.node(childId);
        return { ...node, id: childId };
      });

      childrenNodes.sort((a, b) => a.x - b.x);

      for (let i = 1; i < childrenNodes.length; i++) {
        const previousNode = childrenNodes[i - 1];
        const currentNode = childrenNodes[i];
        const gap = currentNode.x - previousNode.x;

        if (gap > 250) {
          currentNode.x = previousNode.x + 250;

          const nodeIndex = generatedNodes.findIndex(node => node.id === currentNode.id);
          if (nodeIndex !== -1) {
            generatedNodes[nodeIndex].position.x = currentNode.x;
          }
        }
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  };

  useEffect(() => {
    if (data.length > 0) {
      const g = initializeDagreLayout();
      generateNodesAndEdges(g);
    }
  }, [expandedNodes, data, filter]);

  const onConnect = useCallback(
    (params) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div>
      <div style={{ width: '100vw', height: '88vh', color: '#000000', background: '#FFFFFF' }}>
        <ReactFlow
          className='hide-connectors'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.3}
          maxZoom={1.2}
          onNodeClick={(event, node) => {
            Setposid(node.id);
            onclick(node.id);
          }}
          onNodeDoubleClick={(event, node) => {
            onDoubleclick(node.id);
          }}
        >
          <Controls />
          <MiniMap style={{ backgroundColor: '#309e0c' }} />
        </ReactFlow>
        {ismodalvisible && modaldataid && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            borderRadius: '14px',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: 'auto',
            padding: '1px',
            background: 'red',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            cursor: 'pointer',
          }}
            onClick={onmodalclick}
          >
            <Modal
              image={data.find(member => member.id === modaldataid).imageLink}
              BPS={data.find(member => member.id === modaldataid).BPS}
              Designation={data.find(member => member.id === modaldataid).designation}
              Branch={data.find(member => member.id === modaldataid).Branch}
            />
          </div>
        )}
      </div>
      <Scalechart />
    </div>
  );
}
