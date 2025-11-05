# snapshot for 2025-11-05 10:40 local server-time for all partitions
curl "http://localhost:3000/api/occupancy/time-travel?datetime=2025-11-05T10:40:00"

# or for a specific partition (location)
curl "http://localhost:3000/api/occupancy/time-travel?datetime=2025-11-05T10:40:00&location=UK.London"