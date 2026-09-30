import { NextRequest } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { dbFailureResponse, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RecommendationRow {
  id: number;
  category_slug: string;
  widget_type: "range" | "select";
  option_value: string | null;
  min_value: number | null;
  max_value: number | null;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const valueParam = searchParams.get("value");

  if (!category) {
    return Response.json({ error: "Missing category parameter" }, { status: 400 });
  }

  try {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, category_slug, widget_type, option_value, min_value, max_value,
              title, slug, description, sort_order
         FROM assessment_recommendations
        WHERE category_slug = ?
        ORDER BY sort_order ASC`,
      [category]
    );

    const all = rows as RecommendationRow[];

    if (valueParam !== null) {
      const value = Number(valueParam);
      if (!Number.isNaN(value)) {
        return Response.json({
          recommendations: all.filter(
            (row) =>
              row.widget_type === "range" &&
              (row.min_value ?? 0) <= value &&
              (row.max_value ?? Infinity) >= value
          ),
        });
      }
    }

    const option = searchParams.get("option");
    if (option !== null) {
      return Response.json({
        recommendations: all.filter((row) => row.option_value === option),
      });
    }

    return Response.json({ recommendations: all });
  } catch (error) {
    return dbFailureResponse(
      "Assessment API error:",
      error,
      "Failed to load recommendations"
    );
  }
}