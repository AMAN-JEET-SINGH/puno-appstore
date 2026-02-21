-- Run this in PostgreSQL to set up the database
-- CREATE DATABASE pocketapk;
-- \c pocketapk

CREATE TABLE IF NOT EXISTS apps (
  id SERIAL PRIMARY KEY,
  app_id TEXT UNIQUE NOT NULL,
  name TEXT,
  developer TEXT,
  category TEXT,
  platforms TEXT[],
  price TEXT,
  rating NUMERIC,
  installs TEXT,
  size TEXT,
  updated DATE,
  description TEXT,
  icon_file TEXT,
  slug TEXT UNIQUE,
  content_rating TEXT,
  developer_email TEXT,
  privacy_policy TEXT,
  app_type TEXT DEFAULT 'app',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screenshots (
  id SERIAL PRIMARY KEY,
  app_id TEXT REFERENCES apps(app_id) ON DELETE CASCADE,
  file_name TEXT,
  UNIQUE (app_id, file_name)
);
