\set content `cat heritages.json`

INSERT INTO heritages (title, subtitle, type, location, period, image_url, description, full_description, details, visit_info, facilities)
SELECT title, subtitle, type, location, period, image_url, description, full_description, details, visit_info, facilities
FROM json_populate_recordset(NULL::heritages, :'content');