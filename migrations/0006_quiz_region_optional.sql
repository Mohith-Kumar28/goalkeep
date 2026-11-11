-- Nov 11: the quiz no longer asks for a region. The column stays for the
-- rows that have one; SQLite cannot drop NOT NULL in place, so the table is
-- rebuilt with region nullable.

CREATE TABLE quiz_responses_next (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  region TEXT,
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
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  band TEXT
);

INSERT INTO quiz_responses_next (id, name, email, organization, region, sector, role, size, budget, answers, score_data, score_technology, score_process, score_strategy, score_overall, user_agent, created_at, band)
SELECT id, name, email, organization, region, sector, role, size, budget, answers, score_data, score_technology, score_process, score_strategy, score_overall, user_agent, created_at, band
FROM quiz_responses;

DROP TABLE quiz_responses;
ALTER TABLE quiz_responses_next RENAME TO quiz_responses;
CREATE INDEX quiz_responses_created_at ON quiz_responses (created_at);
