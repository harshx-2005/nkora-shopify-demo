import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, AdminSettings } from "@/lib/db";

export async function GET() {
  const db = getDB();
  return NextResponse.json({ settings: db.settings });
}

export async function PUT(request: NextRequest) {
  try {
    const newSettings = await request.json() as AdminSettings;

    if (!newSettings.upiId || !newSettings.accountNumber) {
      return NextResponse.json({ error: "Missing required admin configuration parameters" }, { status: 400 });
    }

    const db = getDB();
    db.settings = {
      ...db.settings,
      ...newSettings
    };
    saveDB(db);

    return NextResponse.json({ settings: db.settings });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: "Failed to update admin settings" }, { status: 500 });
  }
}
