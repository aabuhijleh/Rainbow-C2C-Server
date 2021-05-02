export const getStringFromError = (err: Error = { name: "", message: "" }) => {
  return `message:[${err.message}],\nstack:[${err.stack}]`;
};
