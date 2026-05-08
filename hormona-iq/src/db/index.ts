import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import SymptomLog from './models/SymptomLog';
import { dbSchema } from './schema';

const adapter = new SQLiteAdapter({
  schema: dbSchema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [SymptomLog],
});

export type { SymptomLog };
