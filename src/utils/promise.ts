export interface CancellablePromise<T> extends Promise<T> {
  cancel: (reason?: any) => void;
}

export const makeCancelablePromise = <T>(
  promise: Promise<T>,
): CancellablePromise<T> => {
  let cancelled = false;
  let reason: any;
  let reject: (reason?: any) => void;

  const result = new Promise((resolve, rej) => {
    reject = rej;
    promise
      .then(val => {
        cancelled ? reject(reason) : resolve(val);
      })
      .catch(r => {
        reject(r);
      });
  }) as CancellablePromise<T>;

  result.cancel = (r?: any) => {
    cancelled = true;
    reason = r;
    reject(r);
  };

  return result;
};
