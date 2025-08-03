import { IEntityCache } from '../types/services';

export class NodeCacheEntityCache implements IEntityCache {
  private cache: any;

  constructor(cache: any) {
    this.cache = cache;
  }

  set(key: string, value: any): boolean {
    return this.cache.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  keys(): string[] {
    return this.cache.keys();
  }
}
