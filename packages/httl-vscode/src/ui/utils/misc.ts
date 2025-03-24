export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
