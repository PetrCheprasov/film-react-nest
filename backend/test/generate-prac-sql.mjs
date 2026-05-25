import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const films = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mongodb_initial_stub.json'), 'utf8'),
);

const normalize = (value) =>
  String(value)
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2007\u202f]/g, ' ')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u00ab\u00bb]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

const escape = (value) => normalize(value).replace(/'/g, "''");

const sqlHeader = '\\encoding UTF8\n';

const filmRows = films.map((film) => {
  const tags = `ARRAY[${film.tags.map((t) => `'${escape(t)}'`).join(', ')}]`;
  return `('${film.id}', ${film.rating}, '${escape(film.director)}', ${tags}, '${escape(film.image)}', '${escape(film.cover)}', '${escape(film.title)}', '${escape(film.about)}', '${escape(film.description)}')`;
});

const scheduleRows = films.flatMap((film) =>
  film.schedule.map((session) => {
    const taken =
      session.taken.length > 0
        ? `ARRAY[${session.taken.map((s) => `'${s}'`).join(', ')}]`
        : `'{}'`;
    return `('${session.id}', '${film.id}', '${session.daytime}', '${session.hall}', ${session.rows}, ${session.seats}, ${session.price}, ${taken})`;
  }),
);

const initSql = `DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
    id VARCHAR(36) PRIMARY KEY,
    rating NUMERIC(4, 1) NOT NULL,
    director VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    image VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE schedules (
    id VARCHAR(36) PRIMARY KEY,
    film_id VARCHAR(36) NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime VARCHAR(64) NOT NULL,
    hall VARCHAR(32) NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    taken TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX schedules_film_id_idx ON schedules(film_id);
`;

const filmsSql = `INSERT INTO films (id, rating, director, tags, image, cover, title, about, description)
VALUES
${filmRows.join(',\n')};
`;

const schedulesSql = `INSERT INTO schedules (id, film_id, daytime, hall, rows, seats, price, taken)
VALUES
${scheduleRows.join(',\n')};
`;

const writeUtf8 = (filename, content) =>
  fs.writeFileSync(path.join(__dirname, filename), content, 'utf8');

writeUtf8('prac.init.sql', sqlHeader + initSql);
writeUtf8('prac.films.sql', sqlHeader + filmsSql);
writeUtf8('prac.shedules.sql', sqlHeader + schedulesSql);

console.log('Generated prac.init.sql, prac.films.sql, prac.shedules.sql');
