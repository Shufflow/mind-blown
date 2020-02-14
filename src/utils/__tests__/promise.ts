import { makeCancelablePromise } from '../promise';

it('resolves a promise normally', async () => {
  const value = 'foobar';

  const result = await makeCancelablePromise(Promise.resolve(value));

  expect(result).toEqual(value);
});

it('rejects a promise normally', async () => {
  const error = new Error('error');

  const result = makeCancelablePromise(Promise.reject(error));

  await expect(result).rejects.toBe(error);
});

it('ignores cancelling a resolved promise', async () => {
  const value = 'foobar';

  const promise = makeCancelablePromise(Promise.resolve(value));
  const result = await promise;

  expect(promise.cancel).not.toThrow();
  expect(result).toBe(value);
});

it('ignores cancelling a rejected promise', async () => {
  const result = makeCancelablePromise(Promise.reject('error'));

  expect(result.cancel).not.toThrow();
  await expect(result).rejects.toBeUndefined();
});

it('cancels a running promise without reason', async () => {
  const promise = new Promise(() => {});

  const result = makeCancelablePromise(promise);

  expect(result.cancel).not.toThrow();
  await expect(result).rejects.toBeUndefined();
});

it('cancels a running promise with reason', async () => {
  const error = new Error('error');
  const promise = new Promise(() => {});

  const result = makeCancelablePromise(promise);

  expect(result.cancel.bind(null, error)).not.toThrow();
  await expect(result).rejects.toBe(error);
});
