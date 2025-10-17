import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: ReturnType<typeof drizzle> | null = null;
let queryClient: ReturnType<typeof postgres> | null = null;

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return null;
  }

  // Singleton pattern - reuse connection
  if (db) {
    return db;
  }

  // Connection pool configuration optimized for high load
  queryClient = postgres(process.env.DATABASE_URL, {
    max: 20, // Maximum connections in pool (increased for high traffic)
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
    max_lifetime: 60 * 30, // Close connections after 30 minutes to avoid stale connections
    prepare: false, // Disable prepared statements for better compatibility with pgBouncer
    // Enable keep-alive for connection health
    keep_alive: 5, // Send keep-alive every 5 seconds
  });

  db = drizzle(queryClient);
  return db;
};

// Graceful shutdown handler
export const closeDatabase = async () => {
  if (queryClient) {
    await queryClient.end();
    queryClient = null;
    db = null;
  }
};

export default setup();
