\encoding UTF8
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
    id UUID PRIMARY KEY,
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
    id UUID PRIMARY KEY,
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime VARCHAR(64) NOT NULL,
    hall VARCHAR(32) NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    taken TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX schedules_film_id_idx ON schedules(film_id);
