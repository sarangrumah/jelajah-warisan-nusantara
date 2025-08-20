\set content `cat collections.json`

INSERT INTO collections (title, subtitle, category, museum, period, image_url, description, material, dimensions, origin, discovered_year, condition, significance, cultural_context, related_artifacts)
SELECT title, subtitle, category, museum, period, image_url, description, material, dimensions, origin, discovered_year, condition, significance, cultural_context, related_artifacts
FROM json_populate_recordset(NULL::collections, :'content');