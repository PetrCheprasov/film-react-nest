-- Выполните ОТ СУПЕРПОЛЬЗОВАТЕЛЯ postgres (не от exampleuser):
-- psql -U postgres -f backend/test/prac.users.sql
--
-- Пароль запросит у postgres — это пароль, который вы задавали при установке PostgreSQL.

DO $do$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'exampleuser') THEN
    CREATE ROLE exampleuser WITH LOGIN PASSWORD 'examplepassword';
  ELSE
    ALTER ROLE exampleuser WITH LOGIN PASSWORD 'examplepassword';
  END IF;
END
$do$;

-- Если база уже есть, следующая строка выдаст ошибку — это нормально, переходите к prac.init.sql
CREATE DATABASE exampledb OWNER exampleuser;

GRANT ALL PRIVILEGES ON DATABASE exampledb TO exampleuser;
