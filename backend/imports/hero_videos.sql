\set content `cat hero_videos.json`

INSERT INTO hero_videos (title, video)
SELECT title, video
FROM json_populate_recordset(NULL::hero_videos, :'content');