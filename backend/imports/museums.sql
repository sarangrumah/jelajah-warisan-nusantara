\set content `cat museums.json`

INSERT INTO museums ("name", "subtitle", "type", "description", "location", "address", "latitude", "longitude", "image_url", "gallery_images", "opening_hours", "ticket_price", "website", "facilities", "collections", "contact_info")
SELECT "name", "subtitle", "type", "description", "location", "address", "latitude", "longitude", "image_url", "gallery_images", "opening_hours", "ticket_price", "website", "facilities", "collections", "contact_info"
FROM json_populate_recordset(NULL::museums, :'content');