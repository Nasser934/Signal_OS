#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_FILE="$ROOT_DIR/web/supabase/migrations/20260517_000001_init.sql"

if [[ ! -f "$MIGRATION_FILE" ]]; then
  echo "Migration file not found: $MIGRATION_FILE" >&2
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

echo "Applying migration: $MIGRATION_FILE"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key
);
SQL

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$MIGRATION_FILE"
echo "Schema verification complete."
