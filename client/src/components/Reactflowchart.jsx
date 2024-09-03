import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import axios from 'axios';
import Node from './Node.jsx';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

export default function Reactflowchart({ filter }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const nodecolor = (BPS) => {
    switch (BPS) {
      case 21:
        return "#FF66B2";
      case 20:
        return '#FF66FF';
      case 19:
        return '#3399FF';
      case 18:
        return '#C0C0C0';
      case 17:
        return '#FFFF44';
      case 16:
        return '#B2FF44';
      case 15:
        return '#FFB244';
      case 14:
        return '#66B2FF';
      case 13:
        return '#FF6666';
      case 12:
        return '#66FF66';
      case 11:
        return '#FFCC66'; 
      case 10:
        return '#FF99FF'; 
      case 9:
        return '#66FFCC'; 
      case 8:
        return '#FF9966'; 
      case 7:
        return '#99FF99'; 
      case 6:
        return '#FF6666'; 
      case 5:
        return '#66CCFF'; 
      case 4:
        return '#FFCCCC'; 
      case 3:
        return '#CCFF66'; 
      case 2:
        return '#FFCC99'; 
      case 1:
        return '#FF99CC'; 
      default:
        return 'white';
    }
  };

  const initializeDagreLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', marginx: 20, marginy: 20 });
    g.setDefaultEdgeLabel(() => ({}));

    data.forEach(member => {
      g.setNode(member.id, { label: member.memberName, width: 200, height: 180 });
      member.childrenIds.forEach(childId => {
        g.setEdge(member.id, childId);
      });
    });

    dagre.layout(g);
    return g;
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

  const isNodeVisible = (memberId) => {
    const member = data.find(m => m.id === memberId);
    if (!member) return false;

    if (filter && member.Branch !== filter) {
      return false;
    }

    if (member.parentId == null) return true; 

    return expandedNodes[member.parentId] && isNodeVisible(member.parentId); 
  };

  const generateNodesAndEdges = (g) => {
    const generatedNodes = [];
    const generatedEdges = [];

    data.forEach(member => {
      const node = g.node(member.id);
      const isVisible = isNodeVisible(member.id);

      if (isVisible) {
        generatedNodes.push({
          id: member.id,
          position: { x: node.x, y: node.y },
          data: {
            label: (
              <div >
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
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  padding: '0px',
                  borderColor: 'black'
                }}>
                  {member.memberName}
                </div>
              </div>
            ),
          },
          style: {
            padding: '0px',
            borderRadius: '15px',
            width: '200px',
            height: 'auto',
          },
          hidden: !isVisible,
        });
      }

      if (isVisible && expandedNodes[member.id]) {
        member.childrenIds.forEach(childId => {
          if (isNodeVisible(childId)) {
            generatedEdges.push({
              id: `e${member.id}-${childId}`,
              source: member.id,
              target: childId,
              type: 'smoothstep',
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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.3}
          maxZoom={1.2}
          onNodeClick={(event,node) => {
            toggleNodeExpansion(node.id);
            fitView();

          }}
        >
          <Controls />
          <MiniMap />
          <Background  color='green' />
        </ReactFlow>
      </div>
    </div>
  );
}
