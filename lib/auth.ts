const AUTH_COOKIE = "telecom_mvp_auth";
const AUTH_COOKIE_VALUE = "ok";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

export function getAuthCookieName(): string {
  return AUTH_COOKIE;
}

export function getAuthCookieValue(): string {
  return AUTH_COOKIE_VALUE;
}

export function getDashboardUsername(): string {
  return process.env.DASHBOARD_USERNAME ?? DEFAULT_USERNAME;
}

export function getDashboardPassword(): string {
  return process.env.DASHBOARD_PASSWORD ?? DEFAULT_PASSWORD;
}
