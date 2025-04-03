export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<T>): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };

  debounced.cancel = () => clearTimeout(timeout);

  return debounced as T & { cancel: () => void };
}
