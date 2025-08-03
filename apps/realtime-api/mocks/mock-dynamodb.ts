import { EntityChange } from '../src/types/dynamodb';

export class MockDynamoDBService {
  private mockData: EntityChange[] = [];
  private mockPositions: any[] = [];

  constructor() {}

  async getAllData(limit?: number): Promise<EntityChange[]> {
    return this.mockData.slice(0, limit);
  }

  async getAllEntityPositions(): Promise<any[]> {
    return this.mockPositions;
  }

  async getRecentChanges(): Promise<EntityChange[]> {
    return [];
  }

  async createEntityChange(change: EntityChange): Promise<void> {
    this.mockData.push(change);
  }

  async batchCreateEntityChanges(changes: EntityChange[]): Promise<void> {
    this.mockData.push(...changes);
  }

  async preloadCache(): Promise<void> {
    await this.getAllData();
    await this.getAllEntityPositions();
  }

  clearCache(): void {}

  setMockData(data: EntityChange[]): void {
    this.mockData = data;
  }

  setMockPositions(positions: any[]): void {
    this.mockPositions = positions;
  }

  getMockData(): EntityChange[] {
    return this.mockData;
  }

  getMockPositions(): any[] {
    return this.mockPositions;
  }

  clearMockData(): void {
    this.mockData = [];
    this.mockPositions = [];
  }
}
