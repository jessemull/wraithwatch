import React from 'react';
import { render, screen } from '@testing-library/react';
import { EntityItem } from '../EntityItem';

const createProperty = (name: string, currentValue: any) => ({
  name,
  currentValue,
  lastChanged: new Date().toISOString(),
  history: [],
});

const mockEntity = {
  id: '1',
  name: 'Test Entity',
  type: 'server',
  status: 'active',
  properties: {},
  lastSeen: new Date().toISOString(),
  changesToday: 5,
};

describe('EntityItem', () => {
  it('renders entity id and type', () => {
    render(<EntityItem entity={mockEntity} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Server')).toBeInTheDocument();
  });

  it('renders changes today count', () => {
    render(<EntityItem entity={mockEntity} />);
    expect(screen.getByText('5 changes today')).toBeInTheDocument();
  });

  it('renders last seen time', () => {
    render(<EntityItem entity={mockEntity} />);
    expect(screen.getByText(/Last seen:/)).toBeInTheDocument();
  });

  it('renders entity type color indicator', () => {
    render(<EntityItem entity={mockEntity} />);
    const colorIndicator = document.querySelector('.w-2.h-2.rounded-full');
    expect(colorIndicator).toBeInTheDocument();
  });

  it('handles entity with no properties', () => {
    const entityWithoutProperties = {
      ...mockEntity,
      properties: undefined,
    };
    render(<EntityItem entity={entityWithoutProperties} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles entity with empty properties', () => {
    const entityWithEmptyProperties = {
      ...mockEntity,
      properties: {},
    };
    render(<EntityItem entity={entityWithEmptyProperties} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays AI_Agent priority properties', () => {
    const aiAgentEntity = {
      ...mockEntity,
      type: 'AI_Agent',
      properties: {
        status: createProperty('status', 'active'),
        confidence_score: createProperty('confidence_score', 0.95),
        active_requests: createProperty('active_requests', 10),
        response_time: createProperty('response_time', 150),
        accuracy: createProperty('accuracy', 0.98),
        training_status: createProperty('training_status', 'completed'),
      },
    };
    render(<EntityItem entity={aiAgentEntity} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
  });

  it('displays Network_Node priority properties', () => {
    const networkNodeEntity = {
      ...mockEntity,
      type: 'Network_Node',
      properties: {
        routing_status: createProperty('routing_status', 'online'),
        bandwidth_usage: createProperty('bandwidth_usage', 75),
        connection_count: createProperty('connection_count', 25),
        latency: createProperty('latency', 50),
        error_rate: createProperty('error_rate', 0.1),
        packet_loss: createProperty('packet_loss', 0.05),
      },
    };
    render(<EntityItem entity={networkNodeEntity} />);
    expect(screen.getByText('Bandwidth Usage')).toBeInTheDocument();
    expect(screen.getByText('Connection Count')).toBeInTheDocument();
  });

  it('displays Threat priority properties', () => {
    const threatEntity = {
      ...mockEntity,
      type: 'Threat',
      properties: {
        severity: createProperty('severity', 'high'),
        threat_score: createProperty('threat_score', 85),
        detection_count: createProperty('detection_count', 3),
        mitigation_status: createProperty('mitigation_status', 'in_progress'),
        attack_type: createProperty('attack_type', 'malware'),
      },
    };
    render(<EntityItem entity={threatEntity} />);
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Threat Score')).toBeInTheDocument();
  });

  it('displays System priority properties', () => {
    const systemEntity = {
      ...mockEntity,
      type: 'System',
      properties: {
        status: createProperty('status', 'online'),
        cpu_usage: createProperty('cpu_usage', 65),
        memory_usage: createProperty('memory_usage', 80),
        response_time: createProperty('response_time', 200),
        network_connections: createProperty('network_connections', 15),
        disk_usage: createProperty('disk_usage', 45),
      },
    };
    render(<EntityItem entity={systemEntity} />);
    expect(screen.getByText('Cpu Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });

  it('displays User priority properties', () => {
    const userEntity = {
      ...mockEntity,
      type: 'User',
      properties: {
        last_activity: createProperty('last_activity', '2023-01-01T12:00:00Z'),
        login_count: createProperty('login_count', 5),
        session_duration: createProperty('session_duration', 3600),
        permission_level: createProperty('permission_level', 'admin'),
        failed_login_attempts: createProperty('failed_login_attempts', 0),
      },
    };
    render(<EntityItem entity={userEntity} />);
    expect(screen.getByText('Last Activity')).toBeInTheDocument();
    expect(screen.getByText('Login Count')).toBeInTheDocument();
  });

  it('displays default priority properties for unknown type', () => {
    const unknownTypeEntity = {
      ...mockEntity,
      type: 'Unknown_Type',
      properties: {
        cpu_usage: createProperty('cpu_usage', 50),
        memory_usage: createProperty('memory_usage', 60),
        status: createProperty('status', 'active'),
      },
    };
    render(<EntityItem entity={unknownTypeEntity} />);
    expect(screen.getByText('Cpu Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });

  it('formats numeric property values with units', () => {
    const entityWithNumericProperties = {
      ...mockEntity,
      properties: {
        cpu_usage: createProperty('cpu_usage', 75.5),
        memory_usage: createProperty('memory_usage', 80.2),
        response_time: createProperty('response_time', 150.0),
      },
    };
    render(<EntityItem entity={entityWithNumericProperties} />);
    expect(screen.getByText('75.5%')).toBeInTheDocument();
    expect(screen.getByText('80.2%')).toBeInTheDocument();
    expect(screen.getByText('150.0ms')).toBeInTheDocument();
  });

  it('formats string property values', () => {
    const entityWithStringProperties = {
      ...mockEntity,
      properties: {
        status: createProperty('status', 'active'),
        cpu_usage: createProperty('cpu_usage', 50),
        memory_usage: createProperty('memory_usage', 60),
      },
    };
    render(<EntityItem entity={entityWithStringProperties} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Cpu Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });

  it('limits displayed properties to 5', () => {
    const entityWithManyProperties = {
      ...mockEntity,
      properties: {
        cpu_usage: createProperty('cpu_usage', 10),
        memory_usage: createProperty('memory_usage', 20),
        response_time: createProperty('response_time', 30),
        network_connections: createProperty('network_connections', 40),
        active_requests: createProperty('active_requests', 50),
        accuracy: createProperty('accuracy', 60),
        confidence_score: createProperty('confidence_score', 70),
        latency: createProperty('latency', 80),
        bandwidth_usage: createProperty('bandwidth_usage', 90),
        error_rate: createProperty('error_rate', 100),
        severity: createProperty('severity', 110),
        status: createProperty('status', 120),
        session_duration: createProperty('session_duration', 130),
        login_count: createProperty('login_count', 140),
        last_activity: createProperty('last_activity', 150),
        failed_login_attempts: createProperty('failed_login_attempts', 160),
        permission_level: createProperty('permission_level', 170),
        threat_score: createProperty('threat_score', 180),
        detection_count: createProperty('detection_count', 190),
      },
    };
    render(<EntityItem entity={entityWithManyProperties} />);

    const propertyElements = screen.getAllByText(
      /Cpu Usage|Memory Usage|Response Time|Network Connections|Active Requests|Accuracy|Confidence Score|Latency|Bandwidth Usage|Error Rate|Severity|Status|Session Duration|Login Count|Last Activity|Failed Login Attempts|Permission Level|Threat Score|Detection Count/
    );
    expect(propertyElements.length).toBeLessThanOrEqual(5);
  });

  it('sorts properties alphabetically', () => {
    const entityWithUnsortedProperties = {
      ...mockEntity,
      properties: {
        cpu_usage: createProperty('cpu_usage', 50),
        memory_usage: createProperty('memory_usage', 60),
        response_time: createProperty('response_time', 70),
      },
    };
    render(<EntityItem entity={entityWithUnsortedProperties} />);

    const propertyElements = screen.getAllByText(
      /Cpu Usage|Memory Usage|Response Time/
    );
    const propertyTexts = propertyElements.map(el => el.textContent);
    expect(propertyTexts).toEqual(propertyTexts.sort());
  });

  it('handles entity with zero changes today', () => {
    const entityWithZeroChanges = {
      ...mockEntity,
      changesToday: 0,
    };
    render(<EntityItem entity={entityWithZeroChanges} />);
    expect(screen.getByText('0 changes today')).toBeInTheDocument();
  });

  it('handles entity with large number of changes', () => {
    const entityWithManyChanges = {
      ...mockEntity,
      changesToday: 999,
    };
    render(<EntityItem entity={entityWithManyChanges} />);
    expect(screen.getByText('999 changes today')).toBeInTheDocument();
  });

  it('handles entity with invalid lastSeen date', () => {
    const entityWithInvalidDate = {
      ...mockEntity,
      lastSeen: 'invalid-date',
    };
    render(<EntityItem entity={entityWithInvalidDate} />);
    expect(screen.getByText(/Last seen:/)).toBeInTheDocument();
  });

  it('handles entity with null lastSeen', () => {
    const entityWithNullDate = {
      ...mockEntity,
      lastSeen: 'null',
    };
    render(<EntityItem entity={entityWithNullDate} />);
    expect(screen.getByText(/Last seen:/)).toBeInTheDocument();
  });

  it('handles entity with undefined lastSeen', () => {
    const entityWithUndefinedDate = {
      ...mockEntity,
      lastSeen: '',
    };
    render(<EntityItem entity={entityWithUndefinedDate} />);
    expect(screen.getByText(/Last seen:/)).toBeInTheDocument();
  });

  it('renders with different entity types', () => {
    const entityTypes = [
      'AI_Agent',
      'Network_Node',
      'Threat',
      'System',
      'User',
      'Unknown_Type',
    ];

    entityTypes.forEach(type => {
      const entityWithType = {
        ...mockEntity,
        type,
      };
      const { unmount } = render(<EntityItem entity={entityWithType} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles property with boolean currentValue', () => {
    const entityWithBooleanProperty = {
      ...mockEntity,
      properties: {
        cpu_usage: createProperty('cpu_usage', true),
        memory_usage: createProperty('memory_usage', false),
      },
    };
    render(<EntityItem entity={entityWithBooleanProperty} />);
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('handles property with object currentValue', () => {
    const entityWithObjectProperty = {
      ...mockEntity,
      properties: {
        cpu_usage: createProperty('cpu_usage', { key: 'value' }),
      },
    };
    render(<EntityItem entity={entityWithObjectProperty} />);
    expect(screen.getByText('Cpu Usage')).toBeInTheDocument();
  });

  it('handles property with array currentValue', () => {
    const entityWithArrayProperty = {
      ...mockEntity,
      properties: {
        memory_usage: createProperty('memory_usage', ['tag1', 'tag2']),
      },
    };
    render(<EntityItem entity={entityWithArrayProperty} />);
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });
});
