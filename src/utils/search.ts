import memoize from '@utils/memoize';

export const asyncBinarySearch = async <T>(
  arr: number[],
  compare: (elem: number, context?: T) => Promise<number>,
  context?: T,
  start: number = 0,
  end: number = arr.length - 1,
): Promise<number> => {
  if (start > end) {
    // `end` may be -1 if `arr.length === 1`
    return arr[Math.min(Math.abs(end), start)];
  }

  const mid = Math.floor((start + end) / 2);
  const memCompare = memoize(compare);
  const res = await memCompare(arr[mid], context);
  if (res === 0) {
    return arr[mid];
  } else if (res < 0) {
    return asyncBinarySearch(arr, memCompare, context, mid + 1, end);
  } else {
    return asyncBinarySearch(arr, memCompare, context, start, mid - 1);
  }
};
