export const constants = {
  DEFAULT_INSTRUCTION_TIMEOUT: 100000,
  HTTP_AGENT_NAME: 'HTTL client',
  CONTENT_TYPE: {
    JSON: "application/json",
    FORM: "multipart/form-data",
    URL_ENCODED: "application/x-www-form-urlencoded",
    BINARY: "application/octet-stream",
  }
}

export const Symbols = {
  DIAGNOSTIC_OBJECT: Symbol('httl.DIAGNOSTIC_OBJECT'),
  NESTED_VARIABLE: Symbol('httl.NESTED_VARIABLE'),
}

