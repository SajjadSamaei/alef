import * as migration_20250831_135450 from './20250831_135450';
import * as migration_20251127_052221 from './20251127_052221';
import * as migration_20251225_060937 from './20251225_060937';

export const migrations = [
  {
    up: migration_20250831_135450.up,
    down: migration_20250831_135450.down,
    name: '20250831_135450',
  },
  {
    up: migration_20251127_052221.up,
    down: migration_20251127_052221.down,
    name: '20251127_052221',
  },
  {
    up: migration_20251225_060937.up,
    down: migration_20251225_060937.down,
    name: '20251225_060937'
  },
];
