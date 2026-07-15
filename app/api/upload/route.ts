import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName } = await request.json();

    if (!fileData) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    // Extract base64 content
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid base64 data format" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    
    // Set destination path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean name or use timestamp
    const ext = fileName ? path.extname(fileName) : '.png';
    const cleanName = `screenshot_${Date.now()}${ext}`;
    const destinationPath = path.join(uploadDir, cleanName);

    fs.writeFileSync(destinationPath, fileBuffer);

    const relativeUrl = `/uploads/${cleanName}`;
    return NextResponse.json({ url: relativeUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file screenshot" }, { status: 500 });
  }
}
