import { integer, pgTable, timestamp, varchar, boolean,serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(), 
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  email: varchar({ length: 255 }).notNull().unique(),
  isAdmin: boolean().notNull().default(false),
  resetPasswordToken: varchar({ length: 255 }),
  resetPasswordExpires: timestamp(),
});
