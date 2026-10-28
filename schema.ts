import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
export const trialBudget = sqliteTable('trial_budget', {
  id: integer('id').primaryKey(),
  used: integer('used').notNull().default(0),
});
