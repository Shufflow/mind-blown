import { renderHook } from '@testing-library/react-hooks';

import {
  promiseAborter,
  usePromiseAborterRef,
  PromiseAbortedError,
} from '../hooks';

const hook = (promise: Promise<any>) => {
  const ref = usePromiseAborterRef();
  return promiseAborter(promise, ref);
};

it('resolves a promise normally', async () => {
  const value = 'foobar';
  const { result } = renderHook(hook, { initialProps: Promise.resolve(value) });

  await expect(result.current).resolves.toEqual(value);
});

it('rejects a promise normally', async () => {
  const error = new Error('error');

  const { result } = renderHook(hook, { initialProps: Promise.reject(error) });

  await expect(result.current).rejects.toBe(error);
});

it('ignores cancelling a resolved promise', async () => {
  const value = 'foobar';

  const { result } = renderHook(hook, { initialProps: Promise.resolve(value) });

  await expect(result.current).resolves.toBe(value);
  expect(result.current.cancel).not.toThrow();
});

it('ignores cancelling a rejected promise', async () => {
  const { result } = renderHook(hook, {
    initialProps: Promise.reject('error'),
  });

  expect(result.current.cancel).not.toThrow();
  await expect(result.current).rejects.toBeUndefined();
});

it('cancels a running promise without reason', async () => {
  const promise = new Promise(() => {});

  const { result } = renderHook(hook, { initialProps: promise });

  expect(result.current.cancel).not.toThrow();
  await expect(result.current).rejects.toBeUndefined();
});

it('cancels a running promise with reason', async () => {
  const error = new Error('error');
  const promise = new Promise(() => {});

  const { result } = renderHook(hook, { initialProps: promise });

  expect(result.current.cancel.bind(null, error)).not.toThrow();
  await expect(result.current).rejects.toBe(error);
});

it('cancels the previous promise', async () => {
  const value = 'foobar';
  const { result, rerender } = renderHook(hook, {
    initialProps: new Promise(() => {}),
  });
  const prev = result.current;

  rerender(Promise.resolve(value));

  await expect(result.current).resolves.toBe(value);
  await expect(prev).rejects.toBe(PromiseAbortedError);
});

it('does not cancel same promise', async () => {
  const value = 'foobar';
  const promise = Promise.resolve(value);
  const { result, rerender } = renderHook(hook, {
    initialProps: promise,
  });
  const prev = result.current;

  rerender(promise);

  await expect(result.current).resolves.toBe(value);
  await expect(prev).resolves.toBe(value);
});
