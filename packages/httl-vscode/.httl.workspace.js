const t = {
  name: "@constant-builder/srv-api",
  description: "This is the first project",
  workdir: "./packages/constant-builder/srv-api",
  technologies: ["nodejs", "express", "typescript"],
  // spec: "https://raw.githubusercontent.com/username/repo/branch/path/to/spec.json"
  spec: {
    name: "project1",
    description: "This is the first project",
    type: "project",
    version: "1.0.0",
    paths: {
      "/users/{id}": {
        get: {
          summary: "Get user by id",
          description: "Get user by id",
          operationId: "getUserById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID of user to return",
              schema: {
                type: "integer",
                format: "int64"
              }
            }
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            },
            400: {
              description: "Invalid ID supplied"
            },
            404: {
              description: "User not found"
            }
          }
        }
      }
    },
  },
  prestart: {
    id: ".httl",
    name: "script1",
    code: "get /users/1231232"
  },
  scripts: [
    {
      id: "get /users/{id}",
      name: "script1",
      code: "get /users/1231232"
    }
  ]

}