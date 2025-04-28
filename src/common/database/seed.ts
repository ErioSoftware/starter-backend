import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
import { users, posts, hashPassword } from './schemas/schema';
import { UserRole } from '../../user/user.roles';
import { config } from 'dotenv';

config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const db = drizzle(process.env.DATABASE_URL!);
  const hashedPassword = await hashPassword('12345678');

  // First, create admin user
  await seed(db, { users }).refine((f) => ({
    users: {
      count: 1,
      columns: {
        id: f.default({
          defaultValue: 1000,
        }),
        email: f.default({
          defaultValue: 'admin@test.com',
        }),
        password: f.default({
          defaultValue: hashedPassword,
        }),
        role: f.default({
          defaultValue: UserRole.ADMIN,
        }),
        active: f.default({
          defaultValue: true,
        }),
      },
    },
  }));

  // Then, create rest of the schema
  await seed(db, { users, posts }).refine((f) => ({
    users: {
      count: 2,
      columns: {
        id: f.int({
          minValue: 1001,
          maxValue: 1002,
          isUnique: true,
        }),
        email: f.valuesFromArray({
          values: ['user@test.com', 'user2@test.com'],
          isUnique: true,
        }),
        password: f.default({
          defaultValue: hashedPassword,
        }),
        role: f.default({
          defaultValue: UserRole.BASIC,
        }),
        active: f.default({
          defaultValue: true,
        }),
      },
    },
    posts: {
      count: 10,
      columns: {
        id: f.int({
          minValue: 1000,
          maxValue: 1010,
          isUnique: true,
        }),
        title: f.loremIpsum({ sentencesCount: 2 }),
        description: f.loremIpsum({ sentencesCount: 5 }),
        createdAt: f.default({
          defaultValue: new Date(),
        }),
        updatedAt: f.default({
          defaultValue: new Date(),
        }),
      },
    },
  }));
  console.log('🌱 Database seeded successfully! 🪴');
}

main().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
