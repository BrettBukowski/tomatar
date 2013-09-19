CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE,
    preferences   JSON
);

CREATE TABLE pomodori (
  id        SERIAL PRIMARY KEY,
  user_id   INT REFERENCES users(id) ON DELETE CASCADE,
  notes     TEXT,
  date      DATE NOT NULL,
  time      TIME NOT NULL,
  duration  SMALLINT NOT NULL
);

CREATE TYPE auth_strategy_service AS ENUM ('facebook', 'github', 'google');

CREATE TABLE user_auth_strategies (
    id                SERIAL PRIMARY KEY,
    user_id           INT REFERENCES users(id) ON DELETE CASCADE,
    service           auth_strategy_service NOT NULL,
    service_user_id   TEXT NOT NULL
);
