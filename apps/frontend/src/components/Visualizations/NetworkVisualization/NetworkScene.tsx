import React, { useMemo, useCallback } from 'react';
import { ConnectionLine } from './ConnectionLine';
import { Entity } from '../../../types/entity';
import { EntityChange } from '../../../types/api';
import { NetworkNode } from './NetworkNode';

interface NetworkSceneProps {
  entities: Entity[];
  changes: EntityChange[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

interface NetworkConnection {
  from: Entity;
  to: Entity;
  strength: number;
  type: 'location' | 'agent' | 'network' | 'type';
}

interface NetworkLayout {
  entityPositions: Map<string, [number, number, number]>;
  connections: NetworkConnection[];
}

export const NetworkScene: React.FC<NetworkSceneProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
}) => {
  // Calculate network layout for all entities
  const networkLayout = useMemo((): NetworkLayout => {
    const entityPositions = new Map<string, [number, number, number]>();
    const connections: NetworkConnection[] = [];

    console.log('Building network layout for entities:', entities.map(e => ({ id: e.id, type: e.type })));

    // Group entities by type for better layout
    const aiAgents = entities.filter(e => e.type === 'AI_Agent');
    const systems = entities.filter(e => e.type === 'System');
    const users = entities.filter(e => e.type === 'User');
    const threats = entities.filter(e => e.type === 'Threat');
    const networkNodes = entities.filter(e => e.type === 'Network_Node');

    console.log('Entity groups:', {
      aiAgents: aiAgents.length,
      systems: systems.length,
      users: users.length,
      threats: threats.length,
      networkNodes: networkNodes.length
    });

    // Position AI agents at the top (monitoring level)
    aiAgents.forEach((agent, i) => {
      const angle = (i / Math.max(aiAgents.length, 1)) * Math.PI * 2;
      const radius = 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 3; // AI agents at highest level
      entityPositions.set(agent.id, [x, y, z]);
    });

    // Position systems in the center (infrastructure level)
    systems.forEach((system, i) => {
      const angle = (i / Math.max(systems.length, 1)) * Math.PI * 2;
      const radius = 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0; // Systems at center level
      entityPositions.set(system.id, [x, y, z]);
    });

    // Position users around systems (user level)
    users.forEach((user, i) => {
      const angle = (i / Math.max(users.length, 1)) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 1; // Users at user level
      entityPositions.set(user.id, [x, y, z]);
    });

    // Position threats at the bottom (threat level)
    threats.forEach((threat, i) => {
      const angle = (i / Math.max(threats.length, 1)) * Math.PI * 2;
      const radius = 5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -2; // Threats at lowest level
      entityPositions.set(threat.id, [x, y, z]);
    });

    // Position network nodes around systems (infrastructure level)
    networkNodes.forEach((node, i) => {
      const angle = (i / Math.max(networkNodes.length, 1)) * Math.PI * 2;
      const radius = 7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0; // Network nodes at center level
      entityPositions.set(node.id, [x, y, z]);
    });

    // Position any remaining entities that weren't categorized
    const positionedEntities = new Set(entityPositions.keys());
    const unpositionedEntities = entities.filter(e => !positionedEntities.has(e.id));
    
    console.log('Unpositioned entities:', unpositionedEntities.map(e => ({ id: e.id, type: e.type })));
    
    unpositionedEntities.forEach((entity, i) => {
      const angle = (i / unpositionedEntities.length) * Math.PI * 2;
      const radius = 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0; // Default level
      entityPositions.set(entity.id, [x, y, z]);
    });

    // Create connections based on entity types and relationships
    entities.forEach(entity => {
      // Connect AI agents to systems (monitoring relationship)
      if (entity.type === 'AI_Agent') {
        systems.forEach(system => {
          connections.push({
            from: entity,
            to: system,
            strength: 0.8,
            type: 'agent'
          });
        });
      }

      // Connect users to systems (access relationship)
      if (entity.type === 'User') {
        systems.forEach(system => {
          connections.push({
            from: entity,
            to: system,
            strength: 0.6,
            type: 'network'
          });
        });
      }

      // Connect threats to systems (target relationship)
      if (entity.type === 'Threat') {
        systems.forEach(system => {
          connections.push({
            from: entity,
            to: system,
            strength: 0.9,
            type: 'type'
          });
        });
      }

      // Connect AI agents to users (monitoring relationship)
      if (entity.type === 'AI_Agent') {
        users.forEach(user => {
          connections.push({
            from: entity,
            to: user,
            strength: 0.7,
            type: 'agent'
          });
        });
      }

      // Connect network nodes to systems (infrastructure relationship)
      if (entity.type === 'Network_Node') {
        systems.forEach(system => {
          connections.push({
            from: entity,
            to: system,
            strength: 0.5,
            type: 'network'
          });
        });
      }
    });

    // Add fallback connections to ensure we see multiple connections
    if (entities.length >= 2) {
      // Connect first entity to second entity
      connections.push({
        from: entities[0],
        to: entities[1],
        strength: 1.0,
        type: 'type'
      });
    }

    if (entities.length >= 3) {
      // Connect second entity to third entity
      connections.push({
        from: entities[1],
        to: entities[2],
        strength: 0.8,
        type: 'network'
      });
    }

    if (entities.length >= 4) {
      // Connect third entity to fourth entity
      connections.push({
        from: entities[2],
        to: entities[3],
        strength: 0.6,
        type: 'agent'
      });
    }

    if (entities.length >= 5) {
      // Connect fourth entity to fifth entity
      connections.push({
        from: entities[3],
        to: entities[4],
        strength: 0.7,
        type: 'network'
      });
    }

    console.log('Created connections:', connections.length);
    console.log('Connection details:', connections.map(c => `${c.from.id} -> ${c.to.id} (${c.type})`));
    console.log('Entity positions:', Array.from(entityPositions.entries()));

    return { entityPositions, connections };
  }, [entities]);

  const handleEntityClick = useCallback((entity: Entity) => {
    onEntitySelect?.(entity);
  }, [onEntitySelect]);

  return (
    <group>
      {/* Render entities */}
      {entities.map((entity) => {
        const position = networkLayout.entityPositions.get(entity.id);
        if (!position) {
          console.log('No position found for entity:', entity.id);
          return null;
        }

        return (
          <NetworkNode
            key={entity.id}
            entity={entity}
            position={position}
            isSelected={selectedEntity?.id === entity.id}
            onClick={() => handleEntityClick(entity)}
          />
        );
      })}

      {/* Render connections */}
      {networkLayout.connections.map((connection, index) => {
        const fromPos = networkLayout.entityPositions.get(connection.from.id);
        const toPos = networkLayout.entityPositions.get(connection.to.id);
        if (!fromPos || !toPos) {
          console.log('Missing position for connection:', connection.from.id, '->', connection.to.id);
          return null;
        }

        return (
          <ConnectionLine
            key={`${connection.from.id}-${connection.to.id}-${index}`}
            start={fromPos}
            end={toPos}
            strength={connection.strength}
            type={connection.type}
          />
        );
      })}
    </group>
  );
};
