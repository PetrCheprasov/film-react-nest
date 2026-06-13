# Backend — афиша кинотеатра

NestJS API для списка фильмов, расписания сеансов и бронирования мест. Префикс маршрутов: `/api/afisha`.

## Требования

- Node.js 18+
- PostgreSQL 16+ (локально или Docker)

## Установка

```bash
cd backend
npm install
cp .env.example .env
```

## Переменные окружения

| Переменная           | Описание                         | Пример                                      |
|----------------------|----------------------------------|---------------------------------------------|
| `DATABASE_DRIVER`    | Драйвер БД                       | `postgres`                                  |
| `DATABASE_URL`       | Хост, порт и имя БД (без логина) | `postgres://localhost:5432/exampledb`         |
| `DATABASE_USERNAME`  | Пользователь PostgreSQL          | `exampleuser`                               |
| `DATABASE_PASSWORD`  | Пароль PostgreSQL (обязательно)  | `examplepassword`                           |
| `PORT`               | Порт HTTP-сервера                | `3000`                                      |

## PostgreSQL

Файлы `prac.films.sql` и `prac.shedules.sql` генерируются из `mongodb_initial_stub.json`. Если при импорте появляется ошибка «незавершённая строка в кавычках», пересоздайте их:

```bash
cd backend
npm run generate:sql
```

### Вариант A — Docker (проще)

Из корня репозитория:

```bash
docker-compose up -d
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.init.sql
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.films.sql
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.shedules.sql
```

### Вариант B — PostgreSQL уже установлен в Windows

Ошибка `пользователь "exampleuser" не прошёл проверку подлинности` — пользователя нет **или** пароль в `backend/.env` не совпадает с PostgreSQL.

Пароль в `.env` должен быть **`examplepassword`** (как в `prac.users.sql` и `docker-compose.yml`). Если в `.env` указан другой пароль (например `student`), замените на `examplepassword` или пересоздайте пользователя.

**1.** Создайте пользователя и базу **от `postgres`**, не от `exampleuser`:

```bash
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -f backend/test/prac.users.sql
```

Введите пароль **суперпользователя `postgres`** (тот, что задавали при установке PostgreSQL).  
После этого для `exampleuser` пароль всегда: **`examplepassword`**.

Проверка входа:

```bash
export PGPASSWORD=examplepassword
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U exampleuser -d exampledb -c "SELECT 1"
unset PGPASSWORD
```

Если `psql` не находится в Git Bash (`command not found`), используйте **полный путь** (подставьте свою версию):

Перед импортом в Git Bash задайте UTF-8 для клиента `psql` (иначе кириллица даёт ошибку WIN1251/UTF8):

```bash
export PGCLIENTENCODING=UTF8
```

```bash
"/c/Program Files/PostgreSQL/16/bin/psql.exe" -U postgres -f backend/test/prac.users.sql
"/c/Program Files/PostgreSQL/16/bin/psql.exe" -U exampleuser -d exampledb -f backend/test/prac.init.sql
"/c/Program Files/PostgreSQL/16/bin/psql.exe" -U exampleuser -d exampledb -f backend/test/prac.films.sql
"/c/Program Files/PostgreSQL/16/bin/psql.exe" -U exampleuser -d exampledb -f backend/test/prac.shedules.sql
```

В **cmd** (не Git Bash):

```cmd
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -f backend\test\prac.users.sql
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U exampleuser -d exampledb -f backend\test\prac.init.sql
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U exampleuser -d exampledb -f backend\test\prac.films.sql
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U exampleuser -d exampledb -f backend\test\prac.shedules.sql
```

**Через pgAdmin:** подключитесь как `postgres` → Query Tool → откройте и выполните по очереди файлы из `backend/test/` (сначала `prac.users.sql`, затем `prac.init.sql`, `prac.films.sql`, `prac.shedules.sql`).

**2.** Найти `psql.exe` на диске: в проводнике поиск `psql.exe` или в cmd: `where psql` (если PostgreSQL добавлен в PATH).

**Либо** укажите в `backend/.env` своего существующего пользователя PostgreSQL:

```env
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=ваш_пароль_от_postgres
DATABASE_URL=postgres://localhost:5432/имя_вашей_базы
```

и выполните только `prac.init.sql`, `prac.films.sql`, `prac.shedules.sql` в этой базе.

Статические изображения постеров положите в `backend/public/` (файлы `bg1s.jpg`, `bg1c.jpg` и т.д.).

## Запуск

```bash
npm run start:dev
```

API: `http://localhost:3000/api/afisha`  
Статика: `http://localhost:3000/content/afisha`

## Эндпоинты

| Метод | Путь                  | Описание             |
|-------|-----------------------|----------------------|
| GET   | `/films`              | Список фильмов       |
| GET   | `/films/:id/schedule` | Расписание сеансов   |
| POST  | `/order`              | Бронирование билетов |

## Проверка

```bash
curl http://localhost:3000/api/afisha/films
npm run lint
npm run build
```
