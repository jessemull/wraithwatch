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

    // First, try to use real position data
    entities.forEach(entity => {
      const positionData = positions.find(p => p.entity_id === entity.id);
      if (positionData) {
        const { x, y, z } = positionData.network_position;
        positionMap.set(entity.id, [x, y, z]);
      }
    });

    // Fallback to algorithmic positioning for entities without position data
    const positionedEntities = new Set(positionMap.keys());
    const unpositionedEntities = entities.filter(
      e => !positionedEntities.has(e.id)
    );

    const positionEntities = (
      entityList: Entity[],
      level: keyof typeof NETWORK_SCENE_CONFIG.entityLevels
    ) => {
      const config = NETWORK_SCENE_CONFIG.entityLevels[level];
      entityList.forEach((entity, i) => {
        const angle = (i / Math.max(entityList.length, 1)) * Math.PI * 2;
        const x = Math.cos(angle) * config.radius;
        const z = Math.sin(angle) * config.radius;
        const y = config.y;
        positionMap.set(entity.id, [x, y, z]);
      });
    };

    positionEntities(
      unpositionedEntities.filter(e => e.type === 'Threat'),
      'threats'
    );
    positionEntities(
      unpositionedEntities.filter(e => e.type === 'AI_Agent'),
      'aiAgents'
    );
    positionEntities(
      unpositionedEntities.filter(e => e.type === 'System'),
      'systems'
    );
    positionEntities(
      unpositionedEntities.filter(e => e.type === 'Network_Node'),
      'networkNodes'
    );
    positionEntities(
      unpositionedEntities.filter(e => e.type === 'User'),
      'users'
    );

    // Position any remaining entities with default positioning
    const remainingUnpositioned = entities.filter(e => !positionMap.has(e.id));
    positionEntities(remainingUnpositioned, 'default');

    return positionMap;
  }, [entities, positions, entityGroups]);

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
