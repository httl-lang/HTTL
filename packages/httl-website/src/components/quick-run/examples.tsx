export const examples = [
  {
    title: 'GET request using OpenAPI spec',
    code: `@spec: ${window.location.host}/api/spec.json

# Press Ctrl+Space | Option+Esc to see available paths and methods
get /users/1`
  },
  {
    title: 'Simple GET request',
    code: `get ${window.location.host}/api/users.json`
  }
];
