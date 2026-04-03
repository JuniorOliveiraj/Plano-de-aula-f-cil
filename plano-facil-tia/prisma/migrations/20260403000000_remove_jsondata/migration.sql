-- Migration: remove_jsondata
-- Removes the jsonData column from PlanoCalendario after data migration to Aula table

ALTER TABLE "PlanoCalendario" DROP COLUMN IF EXISTS "jsonData";
