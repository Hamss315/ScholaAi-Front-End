export function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string): string {
  const payload = parseJwt(token);

  return (
    payload?.userId?.toString() ||
    payload?.nameid?.toString() ||
    payload?.sub?.toString() ||
    payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]?.toString() ||
    ""
  );
}

export function getRoleFromToken(token: string): "student" | "teacher" | "admin" | "" {
  const payload = parseJwt(token);

  return (
    payload?.role ||
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    ""
  );
}