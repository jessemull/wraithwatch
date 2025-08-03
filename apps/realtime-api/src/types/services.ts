export interface IPropertyValueGenerator {
  generatePropertyValue(
    propertyName: string,
    currentValue: any,
    entityType: string
  ): any;
  getPropertyChangeFrequency(propertyName: string): number;
  getAllowedPropertiesForEntityType(entityType: string): string[];
}

export interface IEntityCache {
  set(key: string, value: any): boolean;
  get<T>(key: string): T | undefined;
  keys(): string[];
}
