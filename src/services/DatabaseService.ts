import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User, Reward, PurchasableReward } from '../types';

interface MyDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  rewards: {
    key: number;
    value: Reward;
  };
  purchasableRewards: {
    key: number;
    value: PurchasableReward;
  };
}

class DatabaseService {
  private db: IDBPDatabase<MyDB> | null = null;

  async initDB() {
    this.db = await openDB<MyDB>('clicker-game', 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          db.createObjectStore('users', { keyPath: 'name' });
          db.createObjectStore('rewards', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('purchasableRewards', { keyPath: 'id' });
        }
      },
    });
  }

  async getUser(name: string): Promise<User | undefined> {
    if (!this.db) await this.initDB();
    return this.db!.get('users', name);
  }

  async saveUser(user: User) {
    if (!this.db) await this.initDB();
    await this.db!.put('users', user);
  }

  async getRewards(): Promise<Reward[]> {
    if (!this.db) await this.initDB();
    return this.db!.getAll('rewards');
  }

  async saveRewards(rewards: Reward[]) {
    if (!this.db) await this.initDB();
    const tx = this.db!.transaction('rewards', 'readwrite');
    await Promise.all(rewards.map(reward => tx.store.put(reward)));
    await tx.done;
  }

  async getPurchasableRewards(): Promise<PurchasableReward[]> {
    if (!this.db) await this.initDB();
    return this.db!.getAll('purchasableRewards');
  }

  async savePurchasableRewards(rewards: PurchasableReward[]) {
    if (!this.db) await this.initDB();
    const tx = this.db!.transaction('purchasableRewards', 'readwrite');
    await Promise.all(rewards.map(reward => tx.store.put(reward)));
    await tx.done;
  }
}

export const databaseService = new DatabaseService();