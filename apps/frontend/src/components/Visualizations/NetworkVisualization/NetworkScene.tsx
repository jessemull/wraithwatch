import React, { useMemo, useCallback } from 'react';
import { ConnectionLine } from './ConnectionLine';
import { ConnectionParticle } from './ConnectionParticle';
import { NetworkNode } from './NetworkNode';
import { Entity } from '../../../types/entity';
import { NETWORK_SCENE_CONFIG } from '../../../constants/visualization';
import { NetworkLayout, NetworkConnection } from '../../../types/visualization';

interface EntityPosition {
  entity_id: string;
  entity_type: string;
  name: string;
  timeline_position: {
    x: number;
    y: number;
    z: number;
  };
  network_position: {
    x: number;
    y: number;
    z: number;
  };
  change_particles: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

interface NetworkSceneProps {
  entities: Entity[];
  positions: EntityPosition[];
  selectedEntity?: Entity;
  onEntitySelect?: (entity: Entity) => void;
}

export const NetworkScene: React.FC<NetworkSceneProps> = ({
  entities,
  positions,
  selectedEntity,
  onEntitySelect,
}) => {
  const entityGroups = useMemo(
    () => ({
      aiAgents: entities.filter(e => e.type === 'AI_Agent'),
      systems: entities.filter(e => e.type === 'System'),
      users: entities.filter(e => e.type === 'User'),
      threats: entities.filter(e => e.type === 'Threat'),
      networkNodes: entities.filter(e => e.type === 'Network_Node'),
    }),
    [entities]
  );

  const entityPositions = useMemo(() => {
    const positionMap = new Map<string, [number, number, number]>();

    // Use real position data from server
    entities.forEach(entity => {
      const positionData = positions.find(p => p.entity_id === entity.id);
      if (positionData) {
        const { x, y, z } = positionData.network_position;
        positionMap.set(entity.id, [x, y, z]);
      }
    });

    // For any entities without position data, create a more spherical distribution
    const positionedEntities = new Set(positionMap.keys());
    const unpositionedEntities = entities.filter(
      e => !positionedEntities.has(e.id)
    );

    unpositionedEntities.forEach((entity, index) => {
      // Create a spherical distribution for fallback positioning
      const angle =
        (index / Math.max(unpositionedEntities.length, 1)) * Math.PI * 2;
      const elevation =
        (index / Math.max(unpositionedEntities.length, 1)) * Math.PI -
        Math.PI / 2;
      const radius = 8 + Math.random() * 4; // 8-12 units from center

      const x = radius * Math.cos(elevation) * Math.cos(angle);
      const y = radius * Math.sin(elevation);
      const z = radius * Math.cos(elevation) * Math.sin(angle);

      positionMap.set(entity.id, [x, y, z]);
    });

    return positionMap;
  }, [entities, positions]);

  const connections = useMemo(() => {
    const connectionList: NetworkConnection[] = [];

    const createConnections = (
      fromEntities: Entity[],
      toEntities: Entity[],
      rule: keyof typeof NETWORK_SCENE_CONFIG.connectionRules
    ) => {
      const config = NETWORK_SCENE_CONFIG.connectionRules[rule];
      fromEntities.forEach(fromEntity => {
        toEntities.forEach(toEntity => {
          connectionList.push({
            from: fromEntity,
            to: toEntity,
            strength: config.strength,
            type: config.type,
          });
        });
      });
    };

    createConnections(
      entityGroups.aiAgents,
      entityGroups.systems,
      'aiAgentToSystem'
    );
    createConnections(entityGroups.users, entityGroups.systems, 'userToSystem');
    createConnections(
      entityGroups.threats,
      entityGroups.systems,
      'threatToSystem'
    );
    createConnections(
      entityGroups.networkNodes,
      entityGroups.systems,
      'networkNodeToSystem'
    );
    createConnections(
      entityGroups.users,
      entityGroups.networkNodes,
      'userToNetworkNode'
    );

    const fallbackConnections = NETWORK_SCENE_CONFIG.fallbackConnections;
    for (
      let i = 0;
      i < Math.min(entities.length - 1, fallbackConnections.length);
      i++
    ) {
      connectionList.push({
        from: entities[i],
        to: entities[i + 1],
        strength: fallbackConnections[i].strength,
        type: fallbackConnections[i].type,
      });
    }

    return connectionList;
  }, [entities, entityGroups]);

  const networkLayout = useMemo(
    (): NetworkLayout => ({
      entityPositions,
      connections,
    }),
    [entityPositions, connections]
  );

  const handleEntityClick = useCallback(
    (entity: Entity) => {
      onEntitySelect?.(entity);
    },
    [onEntitySelect]
  );

  return (
    <group>
      {entities.map(entity => {
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

      {networkLayout.connections.map((connection, index) => {
        const fromPos = networkLayout.entityPositions.get(connection.from.id);
        const toPos = networkLayout.entityPositions.get(connection.to.id);
        if (!fromPos || !toPos) {
          console.log(
            'Missing position for connection:',
            connection.from.id,
            '->',
            connection.to.id
          );
          return null;
        }

        return (
          <React.Fragment
            key={`${connection.from.id}-${connection.to.id}-${index}`}
          >
            <ConnectionLine
              start={fromPos}
              end={toPos}
              strength={connection.strength}
              type={connection.type}
            />
            <ConnectionParticle
              start={fromPos}
              end={toPos}
              type={connection.type}
              speed={0.3 + Math.random() * 0.4} // Random speed variation per connection
              particleCount={2 + Math.floor(Math.random() * 3)} // Random particle count (2-4)
            />
          </React.Fragment>
        );
      })}
    </group>
  );
};
