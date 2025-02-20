if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (compareFn) {
    return [...this].sort(compareFn);  // Create a sorted copy of the array
  };
}

export {};