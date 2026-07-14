import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    // 1. Generate cryptographic PKCE values
    const state = crypto.randomBytes(16).toString("hex");
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

    // 2. Cache PKCE values in secure browser cookies (needed during callback validation)
    const cookieStore = await cookies();
    cookieStore.set("nkora_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300, // 5 minutes validity
    });
    cookieStore.set("nkora_oauth_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300,
    });

    const shopId = "101063885166";
    const clientId = "377b775c-ee57-422d-8b0f-124080a5d2b8";

    const scopes = "openid email customer-account-api:full";


    // 3. Construct Shopify Customer Account API authorize endpoint URL
    const authUrl = `https://shopify.com/authentication/${shopId}/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;



    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Auth redirect failed:", error);
    return NextResponse.json({ error: "Failed to generate authorization URL" }, { status: 500 });
  }
}
