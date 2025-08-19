\set content `cat hero_slides.json`

INSERT INTO hero_slides (title, subtitle, image, cta)
SELECT title, subtitle, image_url, cta
FROM json_populate_recordset(NULL::hero_slides, :'content');