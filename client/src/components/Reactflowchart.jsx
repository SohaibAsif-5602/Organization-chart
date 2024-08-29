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

export default function Reactflowchart() {
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
        return "#FF66B2"; // Light Pink
      case 20:
        return '#FF66FF'; // Light Magenta
      case 19:
        return '#3399FF'; // Light Blue
      case 18:
        return '#C0C0C0'; // Light Silver
      case 17:
        return '#FFFF44'; // Light Yellow
      case 16:
        return '#B2FF44'; // Light Lime Green
      case 15:
        return '#FFB244'; // Light Orange
      case 14:
        return '#66B2FF'; // Light Sky Blue
      case 13:
        return '#FF6666'; // Light Coral
      case 12:
        return '#66FF66'; // Light Green
      case 11:
        return '#FFCC66'; // Light Peach
      case 10:
        return '#FF99FF'; // Light Purple
      case 9:
        return '#66FFCC'; // Light Aqua
      case 8:
        return '#FF9966'; // Light Salmon
      case 7:
        return '#99FF99'; // Light Mint
      case 6:
        return '#FF6666'; // Light Red
      case 5:
        return '#66CCFF'; // Light Azure
      case 4:
        return '#FFCCCC'; // Light Pinkish
      case 3:
        return '#CCFF66'; // Light Chartreuse
      case 2:
        return '#FFCC99'; // Light Buff
      case 1:
        return '#FF99CC'; // Light Rose
      default:
        return 'white'; // Default white color
    }
};


  const initializeDagreLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB' });
    g.setDefaultEdgeLabel(() => ({}));

    data.forEach(member => {
      g.setNode(member.id, { label: member.memberName, width: 250, height: 150 });
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

  const generateNodesAndEdges = (g) => {
    const generatedNodes = [];
    const generatedEdges = [];

    const isNodeVisible = (memberId) => {
      const member = data.find(m => m.id === memberId);
      if (member.parentId==null) return true;
      return expandedNodes[member.parentId] && isNodeVisible(member.parentId);
    };

    data.forEach(member => {
      const node = g.node(member.id);
      const isVisible = isNodeVisible(member.id);

      generatedNodes.push({
        id: member.id,
        position: { x: node.x, y: node.y },
        data: {
          label: (
            <div  onClick={() => toggleNodeExpansion(member.id)}>
              <div style={{padding:'3.5px'}}><Node 
                BPS={member.BPS}
                Designation={member.designation}
                Branch={member.Branch}
                image={member.imageLink}
              /></div>
              
              <div style={{ fontSize: "1.5em", fontWeight: "bold", backgroundColor: nodecolor(member.BPS),borderBottomLeftRadius:'12px',borderBottomRightRadius:'12px',padding:'0px', borderColor: 'black' }}>
                {member.memberName}
              </div>
            </div>
          ),
        },
        style: {
          padding: '0px',
          borderRadius:'15px',
          width: '200px',
          height: 'auto',
        },
        hidden: !isVisible,
      });

      if (isVisible && expandedNodes[member.id]) {
        member.childrenIds.forEach(childId => {
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
  }, [expandedNodes, data]);

  const onConnect = useCallback(
    (params) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '90vh', color: '#000000', background: '#FFFFFF' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
