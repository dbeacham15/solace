import { fixJsonbStorage } from "@/db/migrations/fix-jsonb-storage";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // SECURITY: Only allow migrations in development/staging
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Forbidden: Migrations must be run manually in production" },
      { status: 403 }
    );
  }

  try {
    await fixJsonbStorage();

    return Response.json({
      success: true,
      message: "Migration completed successfully"
    });
  } catch (error) {
    console.error("Migration endpoint error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Migration failed"
      },
      { status: 500 }
    );
  }
}
