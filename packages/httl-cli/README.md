# HTTL v0.1.7

## HTTP Client for the Terminal

HTTL is a powerful and flexible HTTP client designed for the command line. It leverages the HTTL engine to provide a simple yet robust way to make HTTP requests from the terminal.

[Learn more at httl.dev](https://httl.dev)

## Installation

To install HTTL via npm, run:

```sh
npm install -g httl
```

## Usage

HTTL provides an intuitive syntax for making HTTP requests. The basic usage is:

```sh
httl <method> <url> [headers] [body_format] [body]
```

### Parameters:
- **method**: One of the following HTTP methods:
  - `get`, `post`, `put`, `delete`, `patch`, `head`, `options`, `connect`, `trace`, `lock`, `unlock`, `propfind`, `proppatch`, `copy`, `move`, `mkcol`, `mkcalendar`, `acl`, `search`
- **url**: The URL for the request (absolute or relative when using a `.httl` config file).
- **headers**: Headers in `key:value` format, separated by spaces (e.g., `Authorization:Bearer token`).
- **body_format**: The format of the request body, one of:
  - `--json` (default)
  - `--formdata`
  - `--urlencoded`
  - `--raw`
  - `--bin`
- **body**: The request body (e.g., `'{ "name": "John" }'`).

## Examples

### Basic Requests

#### Simple GET request
```sh
httl get https://httl.dev/api/users
```

#### GET request with a default `.httl` configuration file
```sh
httl get users
```
(Requires a `.httl` file with `@base: https://httl.dev/api`)

#### GET request with headers
```sh
httl get https://httl.dev/api/users Authorization:"Bearer token" Cache-Control:private
```

### Requests with Body

#### POST request with JSON body
```sh
httl post https://httpbin.org/anything '{ "name": "John" }'
```

#### PUT request with form data
```sh
httl put https://httpbin.org/anything --formdata '{ "name": "John" }'
```

#### POST request with URL-encoded body
```sh
httl post https://httpbin.org/anything --urlencoded '{ "name": "John" }'
```

#### POST request with raw body
```sh
httl post https://httpbin.org/anything 'name=John&age=30'
```

#### POST request with binary file
```sh
httl post https://httpbin.org/anything --bin ./file.bin
```

#### POST request with payload from an input stream
```sh
httl post https://httpbin.org/anything < ./payload.json
```

## Running HTTL Files

HTTL can also execute `.httl` files, allowing you to define reusable HTTP requests.

### Running a `.httl` file
```sh
httl ./file.httl
```

### Running a `.httl` file from an input stream
```sh
httl < ./file.httl
```

### Defining a request inline
```sh
httl <<EOF
@base: https://httl.dev/api
@auth-basic: admin admin
post /auth
EOF
```

## More Information
For more details, visit the [HTTL documentation](https://httl.dev/docs).

