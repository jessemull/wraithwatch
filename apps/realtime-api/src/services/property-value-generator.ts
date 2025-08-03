import { IPropertyValueGenerator } from '../types/services';
import {
  PROPERTY_CHANGE_FREQUENCIES,
  ENTITY_TYPE_PROPERTIES,
  STATUS_VALUES,
  VALUE_RANGES,
} from '../constants/property-config';

export class PropertyValueGenerator implements IPropertyValueGenerator {
  generatePropertyValue(
    propertyName: string,
    currentValue: any,
    entityType: string
  ): any {
    const valueGenerators: Record<string, () => any> = {
      // System properties...

      cpu_usage: () =>
        Math.floor(
          VALUE_RANGES.CPU_USAGE.min +
            Math.random() *
              (VALUE_RANGES.CPU_USAGE.max - VALUE_RANGES.CPU_USAGE.min)
        ),
      memory_usage: () =>
        Math.floor(
          VALUE_RANGES.MEMORY_USAGE.min +
            Math.random() *
              (VALUE_RANGES.MEMORY_USAGE.max - VALUE_RANGES.MEMORY_USAGE.min)
        ),
      network_connections: () =>
        Math.floor(
          VALUE_RANGES.NETWORK_CONNECTIONS.min +
            Math.random() *
              (VALUE_RANGES.NETWORK_CONNECTIONS.max -
                VALUE_RANGES.NETWORK_CONNECTIONS.min)
        ),
      disk_usage: () =>
        Math.floor(
          VALUE_RANGES.DISK_USAGE.min +
            Math.random() *
              (VALUE_RANGES.DISK_USAGE.max - VALUE_RANGES.DISK_USAGE.min)
        ),
      response_time: () =>
        Math.floor(
          VALUE_RANGES.RESPONSE_TIME.min +
            Math.random() *
              (VALUE_RANGES.RESPONSE_TIME.max - VALUE_RANGES.RESPONSE_TIME.min)
        ),
      status: () => {
        if (entityType === 'AI_Agent') {
          return STATUS_VALUES.AI_AGENT[
            Math.floor(Math.random() * STATUS_VALUES.AI_AGENT.length)
          ];
        } else {
          return STATUS_VALUES.DEFAULT[
            Math.floor(Math.random() * STATUS_VALUES.DEFAULT.length)
          ];
        }
      },

      // AI Agent properties...

      confidence_score: () =>
        VALUE_RANGES.CONFIDENCE_SCORE.min +
        Math.random() *
          (VALUE_RANGES.CONFIDENCE_SCORE.max -
            VALUE_RANGES.CONFIDENCE_SCORE.min),
      active_requests: () =>
        Math.floor(
          VALUE_RANGES.ACTIVE_REQUESTS.min +
            Math.random() *
              (VALUE_RANGES.ACTIVE_REQUESTS.max -
                VALUE_RANGES.ACTIVE_REQUESTS.min)
        ),
      model_version: () =>
        STATUS_VALUES.MODEL_VERSIONS[
          Math.floor(Math.random() * STATUS_VALUES.MODEL_VERSIONS.length)
        ],
      accuracy: () =>
        VALUE_RANGES.ACCURACY.min +
        Math.random() * (VALUE_RANGES.ACCURACY.max - VALUE_RANGES.ACCURACY.min),
      training_status: () =>
        STATUS_VALUES.TRAINING[
          Math.floor(Math.random() * STATUS_VALUES.TRAINING.length)
        ],

      // Threat properties...

      threat_score: () =>
        VALUE_RANGES.THREAT_SCORE.min +
        Math.random() *
          (VALUE_RANGES.THREAT_SCORE.max - VALUE_RANGES.THREAT_SCORE.min),
      severity: () =>
        STATUS_VALUES.SEVERITY[
          Math.floor(Math.random() * STATUS_VALUES.SEVERITY.length)
        ],
      detection_count: () =>
        Math.floor(
          VALUE_RANGES.DETECTION_COUNT.min +
            Math.random() *
              (VALUE_RANGES.DETECTION_COUNT.max -
                VALUE_RANGES.DETECTION_COUNT.min)
        ),
      source_ip: () =>
        STATUS_VALUES.SOURCE_IPS[
          Math.floor(Math.random() * STATUS_VALUES.SOURCE_IPS.length)
        ],
      attack_type: () =>
        STATUS_VALUES.ATTACK_TYPES[
          Math.floor(Math.random() * STATUS_VALUES.ATTACK_TYPES.length)
        ],
      mitigation_status: () =>
        STATUS_VALUES.MITIGATION[
          Math.floor(Math.random() * STATUS_VALUES.MITIGATION.length)
        ],

      // Network Node properties...

      bandwidth_usage: () =>
        Math.floor(
          VALUE_RANGES.BANDWIDTH_USAGE.min +
            Math.random() *
              (VALUE_RANGES.BANDWIDTH_USAGE.max -
                VALUE_RANGES.BANDWIDTH_USAGE.min)
        ),
      connection_count: () =>
        Math.floor(
          VALUE_RANGES.CONNECTION_COUNT.min +
            Math.random() *
              (VALUE_RANGES.CONNECTION_COUNT.max -
                VALUE_RANGES.CONNECTION_COUNT.min)
        ),
      latency: () =>
        Math.floor(
          VALUE_RANGES.LATENCY.min +
            Math.random() *
              (VALUE_RANGES.LATENCY.max - VALUE_RANGES.LATENCY.min)
        ),
      packet_loss: () => Math.random() * VALUE_RANGES.PACKET_LOSS.max,
      error_rate: () => Math.random() * VALUE_RANGES.ERROR_RATE.max,
      routing_status: () =>
        STATUS_VALUES.ROUTING[
          Math.floor(Math.random() * STATUS_VALUES.ROUTING.length)
        ],

      // User properties...

      login_count: () =>
        Math.floor(Math.random() * VALUE_RANGES.LOGIN_COUNT.max),
      last_activity: () =>
        STATUS_VALUES.ACTIVITY[
          Math.floor(Math.random() * STATUS_VALUES.ACTIVITY.length)
        ],
      session_duration: () =>
        Math.floor(Math.random() * VALUE_RANGES.SESSION_DURATION.max),
      permission_level: () =>
        STATUS_VALUES.PERMISSION[
          Math.floor(Math.random() * STATUS_VALUES.PERMISSION.length)
        ],
      failed_login_attempts: () =>
        Math.floor(Math.random() * VALUE_RANGES.FAILED_LOGIN_ATTEMPTS.max),

      // Sensor properties...

      temperature: () =>
        Math.floor(
          VALUE_RANGES.TEMPERATURE.min +
            Math.random() *
              (VALUE_RANGES.TEMPERATURE.max - VALUE_RANGES.TEMPERATURE.min)
        ),
      humidity: () =>
        Math.floor(
          VALUE_RANGES.HUMIDITY.min +
            Math.random() *
              (VALUE_RANGES.HUMIDITY.max - VALUE_RANGES.HUMIDITY.min)
        ),
      battery: () => Math.floor(Math.random() * VALUE_RANGES.BATTERY.max),
    };

    const generator = valueGenerators[propertyName];
    return generator ? generator() : currentValue;
  }

  getPropertyChangeFrequency(propertyName: string): number {
    return PROPERTY_CHANGE_FREQUENCIES[propertyName] || 0.2;
  }

  getAllowedPropertiesForEntityType(entityType: string): string[] {
    return ENTITY_TYPE_PROPERTIES[entityType] || [];
  }
}
