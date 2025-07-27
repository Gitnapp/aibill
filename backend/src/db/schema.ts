import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const recordsTable = pgTable("records", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    amount: integer("amount").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})