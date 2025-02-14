1. COLOR response

httl method url header:value url'{body}'
httl method url header:value url'{body}'

httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" '{}' // json
httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" -formdata '{ asdsad: "fdsfs" }'
httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" -urlencoded '{ asdsad: "fdsfs" }'
httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" field1=value1  // raw
httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" < file.txt // bin

httl get https://httpbin.org/delay/1 gopa:sysya gopa2:"pysa gopovna" < file.txt // bin


httl api.httl
httl api.httl > data.json
httl '@base: https://localhost \n get /users'
httl <<EOF
@base: https://localhost
get /users
EOF



  