-- Data culture quiz (5 Nov). One row per completed quiz. Answers are the
-- twelve 1-5 values in the order src/content/quiz.ts lists the statements.

CREATE TABLE quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  region TEXT NOT NULL,
  sector TEXT NOT NULL,
  role TEXT NOT NULL,
  size TEXT NOT NULL,
  budget TEXT,
  answers TEXT NOT NULL,
  score_data REAL NOT NULL,
  score_technology REAL NOT NULL,
  score_process REAL NOT NULL,
  score_strategy REAL NOT NULL,
  score_overall REAL NOT NULL,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX quiz_responses_created_at ON quiz_responses (created_at);
