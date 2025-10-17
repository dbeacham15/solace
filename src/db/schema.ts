import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("specialties").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // Indexes for frequently filtered/sorted columns
  cityIdx: index("city_idx").on(table.city),
  degreeIdx: index("degree_idx").on(table.degree),
  yearsIdx: index("years_of_experience_idx").on(table.yearsOfExperience),
  createdAtIdx: index("created_at_idx").on(table.createdAt),

  // Text search indexes for case-insensitive search (using expression indexes)
  firstNameLowerIdx: index("first_name_lower_idx").on(sql`LOWER(${table.firstName})`),
  lastNameLowerIdx: index("last_name_lower_idx").on(sql`LOWER(${table.lastName})`),

  // Composite index for common filter combinations
  cityDegreeIdx: index("city_degree_idx").on(table.city, table.degree),

  // GIN index for JSONB specialty searches
  specialtiesGinIdx: index("specialties_gin_idx").using("gin", table.specialties),
}));

export { advocates };
