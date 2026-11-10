-- The Keep-Up page's sign-up card asks for a name and organization (10 Nov design).

ALTER TABLE newsletter_signups ADD COLUMN name TEXT;
ALTER TABLE newsletter_signups ADD COLUMN organization TEXT;
