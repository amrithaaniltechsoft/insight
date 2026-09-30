import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "insight_health_services",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Every setting above falls back to a localhost default, so a deploy that is
 * missing its environment variables does not fail loudly at boot — it quietly
 * tries to reach a MySQL that is not there, and every query 500s. These helpers
 * turn that into something reportable.
 */
export type DbFailureKind =
  | "unreachable"
  | "access_denied"
  | "unknown_database"
  | "missing_table"
  | "missing_column"
  | "unknown";

/** Node/mysql2 codes that mean the TCP connection or handshake never happened. */
const CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "EPIPE",
  "ETIMEDOUT",
  "PROTOCOL_CONNECTION_LOST",
]);

export interface DbFailure {
  kind: DbFailureKind;
  code: string;
}

/** Sorts a thrown value into the reason it failed. Safe on null/undefined. */
export function classifyDbError(error: unknown): DbFailure {
  const raw =
    typeof error === "object" && error !== null
      ? (error as { code?: unknown; message?: unknown })
      : {};
  const code = typeof raw.code === "string" ? raw.code : "";
  const message = typeof raw.message === "string" ? raw.message : "";

  if (
    CONNECTION_CODES.has(code) ||
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EHOSTUNREACH|connect ETIMEDOUT/i.test(message)
  ) {
    return { kind: "unreachable", code: code || "CONNECTION_FAILED" };
  }
  if (code === "ER_ACCESS_DENIED_ERROR") return { kind: "access_denied", code };
  if (code === "ER_BAD_DB_ERROR") return { kind: "unknown_database", code };
  if (code === "ER_NO_SUCH_TABLE") return { kind: "missing_table", code };
  if (code === "ER_BAD_FIELD_ERROR") return { kind: "missing_column", code };

  return { kind: "unknown", code: code || "UNKNOWN" };
}

/**
 * A message safe to show a visitor. It says what broke without leaking the
 * host, user, or database name that caused it.
 */
export function describeDbFailure(failure: DbFailure): string {
  switch (failure.kind) {
    case "unreachable":
      return "The server cannot reach its database right now. Please try again in a moment.";
    case "access_denied":
      return "The server was refused access to its database. Please try again in a moment.";
    case "unknown_database":
      return "The server cannot find its database. Please try again in a moment.";
    case "missing_table":
      return "This feature is not available yet. Please contact us if you need it.";
    case "missing_column":
      return "This feature needs a database update. Please contact us if you see this.";
    default:
      return "Something went wrong on our side. Please try again.";
  }
}

/**
 * Builds the 500 a route returns when a query fails, with the reason logged and
 * a `code` the client can branch on.
 *
 * Routes call this from a catch block. It exists so every database route reports
 * a failure the same way instead of collapsing every problem into one opaque
 * "something went wrong" string.
 */
export function dbFailureResponse(
  context: string,
  error: unknown,
  fallbackMessage: string
): Response {
  const failure = classifyDbError(error);
  console.error(context, failure.code, error);

  return Response.json(
    {
      message:
        failure.kind === "unknown" ? fallbackMessage : describeDbFailure(failure),
      code: failure.kind,
    },
    { status: 500 }
  );
}