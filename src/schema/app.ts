
import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";


const timestamps = {
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
};

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),

  ...timestamps,
});

export const subjects = pgTable("subjects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "restrict",onUpdate: "cascade", }),

  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),

  ...timestamps,
});

 export const departmentRelations = relations(departments,({many}) => ({subjects: many(subjects)}));  
 export const subjectRelations = relations(subjects,({one,many})=> ({departments: one(departments,{ fields:[subjects.departmentId], references:[departments.id], }),}));

 export  type department = typeof departments.$inferSelect;
 export  type newDepartment = typeof departments.$inferInsert;

 export  type subject = typeof subjects.$inferSelect;
 export  type newSubject = typeof subjects.$inferInsert;