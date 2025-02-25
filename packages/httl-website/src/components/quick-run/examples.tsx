export const examples = [
  {
    title: 'GET request using OpenAPI spec',
    code: `@spec: ${window.location.host}/api/spec.json

# Press Ctrl+Space | Option+Esc to see available paths and methods
get /users/1`
  },
  {
    title: 'PUT request using OpenAPI spec',
    code: `@spec: ${window.location.host}/api/spec.json

# You can generate a request body by selecting the body item from the IntelliSense dropdown.
post /users {
  "id": 123,
  "username": "string_example",
  "email": "string_example",
  "firstName": "string_example",
  "lastName": "string_example"
}`
  },

  {
    title: 'Storing response in a variable for use in subsequent requests',
    code: `@spec: ${window.location.host}/api/spec.json
@auth-basic: admin admin

post /auth 
 as auth

Authorization: Bearer {auth.token}

put /users/1 {
  username: "jdoe_admin",
  email: "jdoe_admin@example.com",
  firstName: "John Admin",
  lastName: "Doe Admin",
  admin: true
}`
  },

  {
    title: 'Simple GET request',
    code: `get ${window.location.host}/api/users`
  }
]