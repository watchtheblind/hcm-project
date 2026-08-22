-- Migración de datos: roles MVP. La columna `role` es VarChar (sin enum en DB),
-- solo hace falta remapear valores existentes al nuevo dominio del backend.
UPDATE "users" SET "role" = 'cirujano' WHERE "role" = 'doctor';
UPDATE "users" SET "role" = 'enfermeria' WHERE "role" = 'nurse';
