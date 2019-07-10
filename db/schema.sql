CREATE TYPE "data_status" AS ENUM (
  'created',
  'check1',
  'check2',
  'done',
  'failure'
);

CREATE TYPE "type" AS ENUM (
  'image',
  'context',
  'voice',
  'survey'
);

CREATE TABLE "data_requester" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "password" varchar,
  "phone_number" varchar,
  "created_at" varchar,
  "point" int,
  "account" varchar
);

CREATE TABLE "data_creator" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "password" varchar,
  "name" varchar,
  "phone_number" varchar,
  "gender" varchar,
  "date_of_birth" varchar,
  "created_at" varchar,
  "rank" varchar,
  "point" int,
  "account" varchar
);

CREATE TABLE "creator_pool" (
  "project_id" varchar,
  "creator_id" varchar
);

CREATE TABLE "requester_pool" (
  "project_id" varchar,
  "requester_id" varchar
);

CREATE TABLE "project" (
  "id" varchar PRIMARY KEY,
  "title" varchar,
  "title_image" varchar,
  "simple_description" varchar,
  "detail_description" varchar,
  "due_date" varchar,
  "created_at" varchar,
  "type" Type,
  "guideline_url" varchar
);

CREATE TABLE "data" (
  "id" varchar PRIMARY KEY,
  "type" Type,
  "payload" varchar,
  "created_at" varchar,
  "status" "data_status",
  "creator_id" int,
  "checker1_id" int,
  "checker2_id" int,
  "project_id" int
);

ALTER TABLE "creator_pool" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id");

ALTER TABLE "creator_pool" ADD FOREIGN KEY ("creator_id") REFERENCES "data_creator" ("id");

ALTER TABLE "requester_pool" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id");

ALTER TABLE "requester_pool" ADD FOREIGN KEY ("requester_id") REFERENCES "data_requester" ("id");

ALTER TABLE "data" ADD FOREIGN KEY ("creator_id") REFERENCES "data_creator" ("id");

ALTER TABLE "data" ADD FOREIGN KEY ("checker1_id") REFERENCES "data_creator" ("id");

ALTER TABLE "data" ADD FOREIGN KEY ("checker2_id") REFERENCES "data_creator" ("id");

ALTER TABLE "data" ADD FOREIGN KEY ("project_id") REFERENCES "project" ("id");