'use client';

import { Entity } from '../../types';
import { NetworkNode } from './NetworkNode';

interface NetworkVisualizationProps {
  entities: Entity[];
}

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  entities,
}) => {
  return (
    <>
      {entities.map((entity, index) => (
        <NetworkNode
          key={entity.id}
          entity={entity}
          index={index}
          total={entities.length}
        />
      ))}
    </>
  );
};
