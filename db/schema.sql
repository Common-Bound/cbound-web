CREATE TYPE "Data_Status" AS ENUM (
  'created',
  'check1',
  'check2',
  'done',
  'failure'
);
CREATE TYPE "Type" AS ENUM ('image', 'context', 'voice', 'survey');
CREATE TABLE "Data_Requester" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "password" varchar,
  "phone_number" varchar,
  "created_at" varchar,
  "point" int,
  "account" varchar
);
CREATE TABLE "Data_Creator" (
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
CREATE TABLE "Creator_Pool" ("project_id" int, "creator_id" int);
CREATE TABLE "Requester_Pool" ("project_id" int, "requester_id" int);
CREATE TABLE "Project" (
  "id" varchar PRIMARY KEY,
  "title" varchar,
  "title_image" varchar,
  "simple_description" varchar,
  "detail_description" varchar,
  "due_date" varchar,
  "created_at" varchar,
  "type" "Type",
  "guideline_url" varchar
);
CREATE TABLE "Data" (
  "id" varchar PRIMARY KEY,
  "type" "Type",
  "payload" varchar,
  "created_at" varchar,
  "status" "Data_Status",
  "creator_id" int,
  "checker1_id" int,
  "checker2_id" int,
  "project_id" int
);
ALTER TABLE
  "Creator_Pool"
ADD
  FOREIGN KEY ("project_id") REFERENCES "Project" ("id");
ALTER TABLE
  "Creator_Pool"
ADD
  FOREIGN KEY ("creator_id") REFERENCES "Data_Creator" ("id");
ALTER TABLE
  "Requester_Pool"
ADD
  FOREIGN KEY ("project_id") REFERENCES "Project" ("id");
ALTER TABLE
  "Requester_Pool"
ADD
  FOREIGN KEY ("requester_id") REFERENCES "Data_Requester" ("id");
ALTER TABLE
  "Data"
ADD
  FOREIGN KEY ("creator_id") REFERENCES "Data_Creator" ("id");
ALTER TABLE
  "Data"
ADD
  FOREIGN KEY ("checker1_id") REFERENCES "Data_Creator" ("id");
ALTER TABLE
  "Data"
ADD
  FOREIGN KEY ("checker2_id") REFERENCES "Data_Creator" ("id");
ALTER TABLE
  "Data"
ADD
  FOREIGN KEY ("project_id") REFERENCES "Project" ("id");