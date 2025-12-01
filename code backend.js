
{
    "type": "camera",
    "name": "HYD_3FLR_A WING PASSAGE CAM 3",
    "ip_address": "10.00.1.11",
    "location": "APAC",
    "city": "HYDERABAD",
    "details": "FLIR",
    "hyperlink": "http://10.200.3.55/camera/index.html",
    "remark": "",
    "person_name": "mayur",
    
}
Curl

curl -X 'POST' \
  'http://127.0.0.1:8000/devices' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '
{
    "type": "camera",
    "name": "HYD_3FLR_A WING PASSAGE CAM 3",
    "ip_address": "10.00.1.11",
    "location": "APAC",
    "city": "HYDERABAD",
    "details": "FLIR",
    "hyperlink": "http://10.200.3.55/camera/index.html",
    "remark": "",
    "person_name": "mayur",
    
}
'
Request URL
http://127.0.0.1:8000/devices
Server response
Code	Details
422	
Error: Unprocessable Content

Response body
Download
{
  "detail": [
    {
      "type": "json_invalid",
      "loc": [
        "body",
        275
      ],
      "msg": "JSON decode error",
      "input": {},
      "ctx": {
        "error": "Illegal trailing comma before end of object"
      }
    }
  ]
}
Response headers
 content-length: 154 
 content-type: application/json 
 date: Mon,01 Dec 2025 08:24:48 GMT 
 server: uvicorn 
Responses
