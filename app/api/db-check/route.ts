import type { RowDataPacket } from "mysql2/promise";
import { classifyDbError, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY DIAGNOSTIC — safe to delete once the deploy is healthy.
 *
 * Every database route in this app returns the same generic 500 when the
 * connection fails, which makes "is the database unreachable?" and "does the
 * database have the column the code expects?" indistinguishable from the
 * outside. This answers both in one request.
 *
 * It deliberately reports booleans and error codes only — no host, user,
 * password or database name — so it can sit on a public URL while being run.
 */
export async function GET() {
  // Whether each variable is defined, never its value. `lib/db.ts` falls back
  // to 127.0.0.1 when these are missing, which is the usual cause of a deploy
  // where every database route 500s.
  const env = {
    DB_HOST: Boolean(process.env.DB_HOST),
    DB_PORT: Boolean(process.env.DB_PORT),
    DB_USER: Boolean(process.env.DB_USER),
    DB_PASSWORD: Boolean(process.env.DB_PASSWORD),
    DB_NAME: Boolean(process.env.DB_NAME),
  };

  try {
    await getDb().query("SELECT 1");
  } catch (error) {
    return Response.json({
      database: "unreachable",
      env,
      failure: classifyDbError(error),
    });
  }

  // The connection is fine, so now check the one column this work added.
  let patientsTitleColumn: boolean | null = null;
  try {
    const [rows] = await getDb().query<RowDataPacket[]>(
      "SHOW COLUMNS FROM patients LIKE 'title'"
    );
    patientsTitleColumn = rows.length > 0;
  } catch (error) {
    // Reachable, but the table is missing or unreadable.
    return Response.json({
      database: "connected",
      env,
      patients_readable: false,
      failure: classifyDbError(error),
    });
  }

  return Response.json({
    database: "connected",
    env,
    patients_readable: true,
    patients_title_column: patientsTitleColumn,
  });
}