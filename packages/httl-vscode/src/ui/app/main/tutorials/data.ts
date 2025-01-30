export type Example = {
  title: string;
  description: string;
  code: string;
};

export const data = [
  {
    title: 'End-to-End Example',
    description: 'Comprehensive Example of all HTTL features',
    code:
      `@base: https://reqres.in/api

# Getting a bearer token
post /login {
  "email": "eve.holt@reqres.in",
  "password": "cityslicka",
}
 as auth # Save the json response body to the variable auth

# Set a global Authorization header wich will be used in all requests below.
# Also we can use dot notation to access the properties of the response body. 
Authorization: Bearer {auth.token}

# Create a new user
post /users {
  "name": "rob",
  "job": "engineer",
}
 as new_user # save the response to the variable new_user

# Update the user
put /users/{new_user.id} {
  "name": "Robert",
  "job": "CEO", # not bad for a new user
}

# Delete the user (too much for a new user)
delete /users/{new_user.id}
# Each request can have an assertion block to validate the status, headers, and body of the response 
assert {
  status: 204,
  headers: {
    "Content-Length": "0",
  }
}`
  },

  {
    title: 'OpenApi: using @spec directive',
    description: 'Shows how to use intelysense with OpenApi schema',
    code:
      `# Also by default @spec header directive will set the base url to the server url from the OpenApi schema
@spec: https://httpbin.org/spec.json

Accept: Application/json

# Press Ctrl+Space | Option+Esc to see the OpenApi shema
post /anything/user {
  "name": "John Doe",
  "age": 30
}`
  },

  {
    title: 'Simple GET request',
    description: 'Make a simple GET request wiothout any headers',
    code: 'get https://jsonplaceholder.typicode.com/todos/1'
  },

  {
    title: 'GET request with the headers',
    description: 'Make a simple GET request with a request header',
    code: 'get https://jsonplaceholder.typicode.com/posts\nAccept: application/json'
  },

  {
    title: 'GET request with global headers',
    description: 'Make a simple GET request with a global request header',
    code: 'Accept: application/json\n\nget https://jsonplaceholder.typicode.com/posts'
  },

  {
    title: 'Simple GET request using the @base header',
    description: 'Demonstrates the use of the @base directive header',
    code: '@base: https://jsonplaceholder.typicode.com\n\nget /posts'
  },

  {
    title: 'POST request with a JSON body',
    description: 'Shows how to make a POST request with a JSON body',
    code: `@base: https://jsonplaceholder.typicode.com

Content-type: application/json; charset=UTF-8

post /posts {
  title: "foo",
  body: "bar",
  userId: 1,
}`
  },

  {
    title: 'POST request with a form-data body',
    description: 'Demonstrates how to make a POST request with a form-data body using formdata keyword',
    code:
      `post https://httpbin.org/anything/user 
formdata {
  "name": "John Doe",
  "age": 30
}`
  },

  {
    title: 'POST request with a form-urlencoded body',
    description: 'Demonstrates how to make a POST request with a form-urlencoded body using urlencoded keyword',
    code:
      `post https://httpbin.org/anything/user 
urlencoded {
  "name": "John Doe",
  "age": 30
}`
  },

  {
    title: 'POST request with a binary body',
    description: 'Demonstrates how to make a POST request with a binary body using bin keyword',
    code:
      `post https://httpbin.org/anything/report 
bin "< path to a file >" # e.g. bin "C:/Users/JohnDoe/Documents/report.pdf"`
  },

  {
    title: 'POST request with a raw body',
    description: 'Demonstrates how to make a POST request with a raw body using raw keyword',
    code:
      `post https://httpbin.org/anything/raw 
raw "raw data"`
  },

  {
    title: 'Using @auth-basic directive',
    description: 'Make a GET request with basic authentication',
    code:
      `get https://httpbin.org/basic-auth/fake-user/fake-password 
@auth-basic: fake-user fake-password`
  },

  {
    title: 'Using .env file',
    description: 'Demonstrates how to use global environment variables or the ones from the .env file',
    code:
      `post https://reqres.in/api/login {
  "email": "eve.holt@reqres.in",
  "password": password, # Add a new variable 'password' with value 'cityslicka' to the .env file or global OS variables in a format 'HTTL_VAR_password=cityslicka'
}`
  },
  {
    title: 'Response assertions',
    description: 'Shows how to assert the response status, headers, and body',
    code:
      `post https://reqres.in/api/login {
  "email": "eve.holt@reqres.in",
  "password": "cityslicka",
}
assert {
  status: 200,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: {
    token: "QpwL5tke4Pnpja7X4",
  },
}`
  },
] satisfies Example[];