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
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // Index for filtering by city
  cityIdx: index("city_idx").on(table.city),
  // Index for filtering by degree
  degreeIdx: index("degree_idx").on(table.degree),
  // Index for filtering/sorting by years of experience
  yearsOfExperienceIdx: index("years_of_experience_idx").on(table.yearsOfExperience),
  // Index for sorting by first name
  firstNameIdx: index("first_name_idx").on(table.firstName),
  // Index for sorting by last name
  lastNameIdx: index("last_name_idx").on(table.lastName),
  // GIN index for JSONB specialties array (enables fast containment searches)
  specialtiesIdx: index("specialties_gin_idx").using("gin", table.specialties),
}));

export { advocates };
