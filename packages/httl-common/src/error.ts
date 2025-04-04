export function serializeError(error) {
  if (!(error instanceof Error)) {
    return error;
  }

  const serialized = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...Object.fromEntries(Object.entries(error))
  };

  return serialized;
}