-- Nov 10 review: newsletter sign-ups record the reader's audience (nonprofit
-- or funder) and the edition they subscribed from; quiz responses record the
-- performance band their results email used.

ALTER TABLE newsletter_signups ADD COLUMN audience TEXT;
ALTER TABLE newsletter_signups ADD COLUMN edition TEXT;
ALTER TABLE quiz_responses ADD COLUMN band TEXT;
