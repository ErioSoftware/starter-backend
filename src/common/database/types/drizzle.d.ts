import * as schema from '../schemas/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleDatabase = NodePgDatabase<typeof schema>;
