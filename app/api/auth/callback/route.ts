import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    // 1. Retrieve cached OAuth state & verifier cookies
    const cookieStore = await cookies();
    const savedState = cookieStore.get("nkora_oauth_state")?.value;
    const codeVerifier = cookieStore.get("nkora_oauth_verifier")?.value;

    // 2. Clear auth parameters cookies immediately
    cookieStore.delete("nkora_oauth_state");
    cookieStore.delete("nkora_oauth_verifier");

    // 3. Verify state against CSRF
    if (!state || !savedState || state !== savedState) {
      return NextResponse.json({ error: "State mismatch or session expired. Please log in again." }, { status: 400 });
    }

    if (!code || !codeVerifier) {
      return NextResponse.json({ error: "Authorization code or verifier missing" }, { status: 400 });
    }

    const shopId = "101063885166";
    const clientId = "877bf73e-ee37-421d-9b6f-128090a5d2b0";



    const tokenUrl = `https://shopify.com/authentication/${shopId}/oauth/token`;



    // 4. Construct form-encoded token request payload
    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
      code_verifier: codeVerifier,
    });

    // 5. POST to Shopify Token Exchange
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    const body = await response.json();

    if (!response.ok || !body.access_token) {
      console.error("Shopify OAuth Token exchange failed:", body);
      return NextResponse.json({ error: body.error_description || "Token exchange failed" }, { status: response.status });
    }

    // 6. Return a small HTML page that stores the token in localStorage and redirects the user
    // This allows the storefront React context (which reads from localStorage) to synchronize seamlessly.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating Session...</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #FAFAFA;
              color: #333333;
            }
            .spinner-container {
              text-align: center;
              padding: 24px;
            }
            .spinner {
              border: 3px solid rgba(233, 142, 165, 0.1);
              width: 36px;
              height: 36px;
              clear: both;
              margin: 20px auto;
              border-radius: 50%;
              border-left-color: #E98EA5;
              animation: spin 1s infinite linear;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .text {
              font-size: 13px;
              font-weight: 500;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="spinner-container">
            <div class="spinner"></div>
            <div class="text">Authenticating NKORA Session...</div>
          </div>
          <script>
            try {
              localStorage.setItem('nkora_customer_token', '${body.access_token}');
              window.location.href = '/account';
            } catch (e) {
              console.error("Failed to write access token:", e);
              window.location.href = '/account/login?error=localstorage_blocked';
            }
          </script>
        </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Callback handler crashed:", error);
    return NextResponse.json({ error: "Internal Auth Server Error" }, { status: 500 });
  }
}
