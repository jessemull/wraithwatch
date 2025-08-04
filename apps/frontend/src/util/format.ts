export const formatLabel = (label: string): string => {
  return label.replace(/_/g, ' ');
};

export const formatCamelCase = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export const formatSnakeCase = (text: string): string => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toString();
  }

  // Handle common formatting cases
  if (value.includes('_')) {
    return formatLabel(value);
  }

  return value;
};
