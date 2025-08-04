import {
  formatLabel,
  formatCamelCase,
  formatSnakeCase,
  formatValue,
} from '../format';

describe('formatLabel', () => {
  it('replaces underscores with spaces', () => {
    expect(formatLabel('hello_world')).toBe('hello world');
    expect(formatLabel('test_case_example')).toBe('test case example');
    expect(formatLabel('no_underscores')).toBe('no underscores');
  });

  it('handles strings without underscores', () => {
    expect(formatLabel('hello')).toBe('hello');
    expect(formatLabel('')).toBe('');
    expect(formatLabel('test')).toBe('test');
  });

  it('handles multiple consecutive underscores', () => {
    expect(formatLabel('hello__world')).toBe('hello  world');
    expect(formatLabel('test___example')).toBe('test   example');
  });

  it('handles underscores at the beginning and end', () => {
    expect(formatLabel('_hello_world_')).toBe(' hello world ');
    expect(formatLabel('_test_')).toBe(' test ');
  });

  it('handles empty string', () => {
    expect(formatLabel('')).toBe('');
  });

  it('handles single underscore', () => {
    expect(formatLabel('_')).toBe(' ');
  });
});

describe('formatCamelCase', () => {
  it('formats camelCase to title case', () => {
    expect(formatCamelCase('helloWorld')).toBe('Hello World');
    expect(formatCamelCase('testCaseExample')).toBe('Test Case Example');
    expect(formatCamelCase('camelCase')).toBe('Camel Case');
  });

  it('handles single word camelCase', () => {
    expect(formatCamelCase('hello')).toBe('Hello');
    expect(formatCamelCase('test')).toBe('Test');
  });

  it('handles empty string', () => {
    expect(formatCamelCase('')).toBe('');
  });

  it('handles strings without camelCase', () => {
    expect(formatCamelCase('hello')).toBe('Hello');
    expect(formatCamelCase('test')).toBe('Test');
  });

  it('handles strings with numbers', () => {
    expect(formatCamelCase('hello123World')).toBe('Hello123 World');
    expect(formatCamelCase('test456Case')).toBe('Test456 Case');
  });

  it('handles strings starting with uppercase', () => {
    expect(formatCamelCase('HelloWorld')).toBe('Hello World');
    expect(formatCamelCase('TestCase')).toBe('Test Case');
  });

  it('handles strings with special characters', () => {
    expect(formatCamelCase('helloWorld123')).toBe('Hello World123');
    expect(formatCamelCase('testCase456')).toBe('Test Case456');
  });

  it('handles strings with multiple consecutive capitals', () => {
    expect(formatCamelCase('helloWORLD')).toBe('Hello W O R L D');
    expect(formatCamelCase('testCASE')).toBe('Test C A S E');
  });
});

describe('formatSnakeCase', () => {
  it('formats snake_case to title case', () => {
    expect(formatSnakeCase('hello_world')).toBe('Hello World');
    expect(formatSnakeCase('test_case_example')).toBe('Test Case Example');
    expect(formatSnakeCase('snake_case')).toBe('Snake Case');
  });

  it('handles single word snake_case', () => {
    expect(formatSnakeCase('hello')).toBe('Hello');
    expect(formatSnakeCase('test')).toBe('Test');
  });

  it('handles empty string', () => {
    expect(formatSnakeCase('')).toBe('');
  });

  it('handles strings without underscores', () => {
    expect(formatSnakeCase('hello')).toBe('Hello');
    expect(formatSnakeCase('test')).toBe('Test');
  });

  it('handles multiple consecutive underscores', () => {
    expect(formatSnakeCase('hello__world')).toBe('Hello  World');
    expect(formatSnakeCase('test___example')).toBe('Test   Example');
  });

  it('handles underscores at the beginning and end', () => {
    expect(formatSnakeCase('_hello_world_')).toBe(' Hello World ');
    expect(formatSnakeCase('_test_')).toBe(' Test ');
  });

  it('handles single underscore', () => {
    expect(formatSnakeCase('_')).toBe(' ');
  });

  it('handles strings with numbers', () => {
    expect(formatSnakeCase('hello_123_world')).toBe('Hello 123 World');
    expect(formatSnakeCase('test_456_case')).toBe('Test 456 Case');
  });

  it('handles strings with special characters', () => {
    expect(formatSnakeCase('hello_world_123')).toBe('Hello World 123');
    expect(formatSnakeCase('test_case_456')).toBe('Test Case 456');
  });

  it('handles mixed case in snake_case', () => {
    expect(formatSnakeCase('hello_World')).toBe('Hello World');
    expect(formatSnakeCase('Test_case')).toBe('Test Case');
  });
});

describe('formatValue', () => {
  it('converts numbers to strings', () => {
    expect(formatValue(123)).toBe('123');
    expect(formatValue(0)).toBe('0');
    expect(formatValue(-456)).toBe('-456');
    expect(formatValue(3.14)).toBe('3.14');
  });

  it('handles strings with underscores', () => {
    expect(formatValue('hello_world')).toBe('hello world');
    expect(formatValue('test_case_example')).toBe('test case example');
    expect(formatValue('no_underscores')).toBe('no underscores');
  });

  it('handles strings without underscores', () => {
    expect(formatValue('hello')).toBe('hello');
    expect(formatValue('test')).toBe('test');
    expect(formatValue('')).toBe('');
  });

  it('handles empty string', () => {
    expect(formatValue('')).toBe('');
  });

  it('handles strings with numbers', () => {
    expect(formatValue('hello_123_world')).toBe('hello 123 world');
    expect(formatValue('test_456_case')).toBe('test 456 case');
  });

  it('handles strings with special characters', () => {
    expect(formatValue('hello_world_123')).toBe('hello world 123');
    expect(formatValue('test_case_456')).toBe('test case 456');
  });

  it('handles multiple consecutive underscores in strings', () => {
    expect(formatValue('hello__world')).toBe('hello  world');
    expect(formatValue('test___example')).toBe('test   example');
  });

  it('handles underscores at the beginning and end of strings', () => {
    expect(formatValue('_hello_world_')).toBe(' hello world ');
    expect(formatValue('_test_')).toBe(' test ');
  });

  it('handles single underscore in strings', () => {
    expect(formatValue('_')).toBe(' ');
  });

  it('handles zero as number', () => {
    expect(formatValue(0)).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatValue(-123)).toBe('-123');
    expect(formatValue(-3.14)).toBe('-3.14');
  });

  it('handles decimal numbers', () => {
    expect(formatValue(3.14159)).toBe('3.14159');
    expect(formatValue(0.5)).toBe('0.5');
  });

  it('handles large numbers', () => {
    expect(formatValue(1000000)).toBe('1000000');
    expect(formatValue(999999999)).toBe('999999999');
  });
});
