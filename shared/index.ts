// Export all shared types and utilities
export * from './types';

// Shared utilities
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

export const getChangeType = (
  oldValue: string | number,
  newValue: string | number
): 'increment' | 'decrement' | 'replacement' => {
  if (typeof oldValue === 'number' && typeof newValue === 'number') {
    return newValue > oldValue ? 'increment' : 'decrement';
  }
  return 'replacement';
};

export const generateEntityId = (): string => {
  return `entity-${Math.random().toString(36).substr(2, 9)}`;
};
