CREATE TYPE "data_status" AS ENUM (
  'created',
  'check1',
  'check2',
  'done',
  'failure'
);
CREATE TYPE "type" AS ENUM ('image', 'context', 'voice', 'survey');
CREATE TYPE "project_type" AS ENUM ('normal', 'inspection');
CREATE TYPE "schedule_state" AS ENUM ('queued', 'reserved');
CREATE TABLE "data_requester" (
  "id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "password" varchar,
  "phone_number" varchar,
  "created_at" varchar,
  "point" int,
  "account" varchar
);
CREATE TABLE "data_creator" (
  "id" varchar PRIMARY KEY,
  "email" varchar UNIQUE,
  "password" varchar,
  "name" varchar,
  "phone_number" varchar,
  "gender" varchar,
  "date_of_birth" varchar,
  "created_at" varchar,
  "rank" varchar,
  "point" int,
  "account" varchar,
  "reliability" float
);
CREATE TABLE "creator_pool" ("project_id" varchar, "creator_id" varchar);
CREATE TABLE "requester_pool" (
  "project_id" varchar,
  "requester_id" varchar
);
CREATE TABLE "inspector_pool" (
  "inspector_id" varchar,
  "data_id" varchar,
  "inspected_at" varchar
);
CREATE TABLE "project" (
  "id" varchar PRIMARY KEY,
  "ref_project" varchar,
  "title" varchar,
  "title_image" varchar,
  "simple_description" varchar,
  "detail_description" varchar,
  "due_date" varchar,
  "created_at" varchar,
  "type" type,
  "project_type" project_type,
  "guideline_url" varchar,
  "reward" int
);
CREATE TABLE "data" (
  "id" varchar PRIMARY KEY,
  "type" type,
  "payload" jsonb,
  "created_at" varchar,
  "status" "data_status",
  "creator_id" varchar,
  "inspector" varchar [],
  "project_id" varchar,
  "schedule_state" schedule_state,
  "reliability" float,
  "inspector_count" int
);
ALTER TABLE
  "creator_pool"
ADD
  FOREIGN KEY ("project_id") REFERENCES "project" ("id");
ALTER TABLE
  "creator_pool"
ADD
  FOREIGN KEY ("creator_id") REFERENCES "data_creator" ("id");
ALTER TABLE
  "requester_pool"
ADD
  FOREIGN KEY ("project_id") REFERENCES "project" ("id");
ALTER TABLE
  "requester_pool"
ADD
  FOREIGN KEY ("requester_id") REFERENCES "data_requester" ("id");
ALTER TABLE
  "inspector_pool"
ADD
  FOREIGN KEY ("inspector_id") REFERENCES "data_creator" ("id");
ALTER TABLE
  "inspector_pool"
ADD
  FOREIGN KEY ("data_id") REFERENCES "data" ("id");
ALTER TABLE
  "data"
ADD
  FOREIGN KEY ("creator_id") REFERENCES "data_creator" ("id");
ALTER TABLE
  "data"
ADD
  FOREIGN KEY ("project_id") REFERENCES "project" ("id");