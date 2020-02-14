import { MutableRefObject, useRef } from 'react';

import { makeCancelablePromise, CancellablePromise } from './promise';

interface CancellableStorage<T> {
  promise: Promise<T>;
  cancellable: CancellablePromise<T>;
}

export const PromiseAbortedError = 'cancelled';

export const promiseAborter = <T>(
  promise: Promise<T>,
  context: MutableRefObject<CancellableStorage<T> | undefined>,
): CancellablePromise<T> => {
  if (context.current?.promise !== promise) {
    context.current?.cancellable.cancel(PromiseAbortedError);
    context.current = {
      promise,
      cancellable: makeCancelablePromise(promise),
    };
  }

  return context.current.cancellable;
};

// tslint:disable-next-line: no-unnecessary-callback-wrapper
export const usePromiseAborterRef = <T>() =>
  useRef<CancellableStorage<T> | undefined>();
