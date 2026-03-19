#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding system templates..."
node dist/seed.js

echo "Starting FormIQ API..."
exec node dist/index.js
