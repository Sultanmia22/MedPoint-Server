ALTER TABLE "users" ADD COLUMN "displayId" TEXT;

WITH numbered_users AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS row_number
  FROM "users"
)
UPDATE "users"
SET "displayId" = 'MP-' || (9999 + numbered_users.row_number)::TEXT
FROM numbered_users
WHERE "users"."id" = numbered_users."id";

ALTER TABLE "users" ALTER COLUMN "displayId" SET NOT NULL;

CREATE UNIQUE INDEX "users_displayId_key" ON "users"("displayId");
