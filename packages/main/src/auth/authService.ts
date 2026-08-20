const AUTH_SERVER = "https://localhost:7043";
const CLIENT_ID = "doar-web";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

const STATE_KEY = "logixsys_auth_state";
const VERIFIER_KEY = "logixsys_pkce_verifier";
const ACCESS_TOKEN_KEY = "logixsys_access_token";

function base64UrlEncode(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function randomString(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return base64UrlEncode(bytes);
}

async function createCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);

    const digest = await crypto.subtle.digest("SHA-256", data);

    return base64UrlEncode(new Uint8Array(digest));
}

export async function login(): Promise<void> {
    const state = randomString(32);
    const verifier = randomString(64);
    const challenge = await createCodeChallenge(verifier);

    sessionStorage.setItem(STATE_KEY, state);
    sessionStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: "openid profile email api",
        code_challenge: challenge,
        code_challenge_method: "S256",
        state,
    });

    window.location.assign(
        `${AUTH_SERVER}/connect/authorize?${params.toString()}`
    );
}

export async function handleCallback(
    code: string,
    state: string
): Promise<void> {
    const savedState = sessionStorage.getItem(STATE_KEY);
    const verifier = sessionStorage.getItem(VERIFIER_KEY);

    if (!savedState || savedState !== state) {
        throw new Error("Invalid OAuth state.");
    }

    if (!verifier) {
        throw new Error("PKCE verifier was not found.");
    }

    const response = await fetch(`${AUTH_SERVER}/connect/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: verifier,
        }),
    });

    if (!response.ok) {
        const text = await response.text();

        throw new Error(`Token request failed: ${response.status} ${text}`);
    }

    const token: unknown = await response.json();

    if (
        typeof token !== "object" ||
        token === null ||
        !("access_token" in token) ||
        typeof token.access_token !== "string"
    ) {
        throw new Error("Token response does not contain a valid access_token");
    }

    sessionStorage.removeItem(STATE_KEY);
    sessionStorage.removeItem(VERIFIER_KEY);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
}

export function getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getAccessToken();
}

export function logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(STATE_KEY);
    sessionStorage.removeItem(VERIFIER_KEY);
}
