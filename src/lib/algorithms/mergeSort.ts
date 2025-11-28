type Comparator<T> = (a: T, b: T) => number;

type SortOptions<T> = {
  comparator?: Comparator<T>;
  key?: keyof T;
  direction?: "asc" | "desc";
};

function compareValues(valueA: unknown, valueB: unknown): number {
  if (valueA === valueB) return 0;
  if (valueA == null) return -1;
  if (valueB == null) return 1;

  if (typeof valueA === "number" && typeof valueB === "number") {
    return valueA - valueB;
  }

  return String(valueA).localeCompare(String(valueB), undefined, { sensitivity: "base" });
}

function defaultComparator<T>(key: keyof T, direction: "asc" | "desc" = "asc"): Comparator<T> {
  return (a, b) => {
    const recordA = a as Record<PropertyKey, unknown>;
    const recordB = b as Record<PropertyKey, unknown>;
    const valueA = recordA[key as PropertyKey];
    const valueB = recordB[key as PropertyKey];

    const result = compareValues(valueA, valueB);
    return direction === "asc" ? result : -result;
  };
}

export function mergeSort<T>(items: T[], options: SortOptions<T> = {}): T[] {
  if (items.length <= 1) {
    return items.slice();
  }

  const { comparator, key, direction } = options;

  let compareFn: Comparator<T>;

  if (comparator) {
    compareFn = comparator;
  } else if (key) {
    compareFn = defaultComparator(key, direction);
  } else {
    throw new Error("mergeSort requires either a comparator or key to be provided");
  }

  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), { comparator: compareFn });
  const right = mergeSort(items.slice(middle), { comparator: compareFn });

  return merge(left, right, compareFn);
}

function merge<T>(left: T[], right: T[], comparator: Comparator<T>): T[] {
  const result: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (comparator(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex += 1;
    } else {
      result.push(right[rightIndex]);
      rightIndex += 1;
    }
  }

  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex += 1;
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex += 1;
  }

  return result;
}
