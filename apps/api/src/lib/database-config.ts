export function getDatabaseConfigError(): string | null {
  const databaseUrl = process.env["DATABASE_URL"]?.trim();

  if (!databaseUrl) {
    return "DATABASE_URL is not configured. Add a PostgreSQL connection string to apps/api/.env.local.";
  }

  if (/REPLACE_WITH|placeholder|example/i.test(databaseUrl)) {
    return "DATABASE_URL is still a placeholder. Replace it with the real SpeedyVan PostgreSQL/Neon connection string in apps/api/.env.local.";
  }

  try {
    const parsed = new URL(databaseUrl.replace(/^"|"$/g, ""));
    if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
      return "DATABASE_URL must be a PostgreSQL connection string.";
    }
  } catch {
    return "DATABASE_URL is not a valid connection string.";
  }

  return null;
}
