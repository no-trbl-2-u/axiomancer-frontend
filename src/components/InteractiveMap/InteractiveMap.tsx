import styled from "@emotion/styled";
import { useState } from "react";

interface MapNodeData {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  area: string;
  unlocked: boolean;
}

interface InteractiveMapProps {
  currentLocation: { x: number; y: number };
  onNodeClick: (node: MapNodeData) => void;
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  border-radius: 12px;
  overflow: hidden;
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const MapNode = styled.circle<{ isCurrentLocation: boolean; unlocked: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.unlocked ? `
    fill: ${props.isCurrentLocation ? '#8B4513' : '#4a5568'};
    stroke: ${props.isCurrentLocation ? '#A0522D' : '#718096'};
    stroke-width: ${props.isCurrentLocation ? '4' : '2'};
    
    &:hover {
      fill: #8B4513;
      stroke: #A0522D;
      stroke-width: 3;
      r: 8;
    }
  ` : `
    fill: #2d3748;
    stroke: #4a5568;
    stroke-width: 1;
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const NodeLabel = styled.text<{ unlocked: boolean }>`
  fill: ${props => props.unlocked ? '#e2e8f0' : '#718096'};
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
`;

const ConnectionLine = styled.line`
  stroke: #4a5568;
  stroke-width: 2;
  stroke-dasharray: 5,5;
  opacity: 0.6;
`;

// Mock map nodes - in a real game these would come from the backend
const mapNodes: MapNodeData[] = [
  {
    id: 'starting-town',
    name: 'Harbor Town',
    coordinates: { x: 50, y: 80 },
    area: 'starting-town',
    unlocked: true
  },
  {
    id: 'forest-north',
    name: 'Whispering Woods',
    coordinates: { x: 50, y: 50 },
    area: 'forest-north',
    unlocked: true
  },
  {
    id: 'mountain-east',
    name: 'Misty Peaks',
    coordinates: { x: 80, y: 60 },
    area: 'mountain-east',
    unlocked: true
  },
  {
    id: 'ruins-west',
    name: 'Ancient Ruins',
    coordinates: { x: 20, y: 40 },
    area: 'ruins-west',
    unlocked: false
  },
  {
    id: 'labyrinth-entrance',
    name: 'Labyrinth Gate',
    coordinates: { x: 50, y: 20 },
    area: 'labyrinth-entrance',
    unlocked: false
  }
];

// Node connections for drawing paths
const connections = [
  ['starting-town', 'forest-north'],
  ['forest-north', 'mountain-east'],
  ['forest-north', 'ruins-west'],
  ['forest-north', 'labyrinth-entrance']
];

function InteractiveMap({ currentLocation, onNodeClick }: InteractiveMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isCurrentLocation = (node: MapNodeData): boolean => {
    return node.coordinates.x === currentLocation.x && node.coordinates.y === currentLocation.y;
  };

  const getNodeById = (id: string): MapNodeData | undefined => {
    return mapNodes.find(node => node.id === id);
  };

  const handleNodeClick = (node: MapNodeData) => {
    if (!node.unlocked) return;
    onNodeClick(node);
  };

  return (
    <MapContainer>
      <MapSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Draw connection lines */}
        {connections.map(([fromId, toId]) => {
          const fromNode = getNodeById(fromId);
          const toNode = getNodeById(toId);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <ConnectionLine
              key={`${fromId}-${toId}`}
              x1={fromNode.coordinates.x}
              y1={fromNode.coordinates.y}
              x2={toNode.coordinates.x}
              y2={toNode.coordinates.y}
            />
          );
        })}

        {/* Draw nodes */}
        {mapNodes.map((node) => (
          <g key={node.id}>
            <MapNode
              cx={node.coordinates.x}
              cy={node.coordinates.y}
              r={isCurrentLocation(node) ? 7 : 6}
              isCurrentLocation={isCurrentLocation(node)}
              unlocked={node.unlocked}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            />
            
            {/* Node labels */}
            <NodeLabel
              x={node.coordinates.x}
              y={node.coordinates.y - 12}
              unlocked={node.unlocked}
            >
              {node.name}
            </NodeLabel>
            
            {/* Show additional info on hover */}
            {hoveredNode === node.id && node.unlocked && (
              <NodeLabel
                x={node.coordinates.x}
                y={node.coordinates.y + 20}
                unlocked={node.unlocked}
                style={{ fontSize: '10px', opacity: 0.8 }}
              >
                Click to travel
              </NodeLabel>
            )}
          </g>
        ))}
        
        {/* Current location indicator */}
        {mapNodes.some(node => isCurrentLocation(node)) && (
          <circle
            cx={currentLocation.x}
            cy={currentLocation.y}
            r="10"
            fill="none"
            stroke="#8B4513"
            strokeWidth="3"
            opacity="0.7"
          >
            <animate
              attributeName="r"
              values="10;15;10"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.3;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </MapSvg>
    </MapContainer>
  );
}

export default InteractiveMap;