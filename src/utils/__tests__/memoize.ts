import { createSandbox } from 'sinon';

import memoize, { wipeMemoizeCache } from '../memoize';

const sandbox = createSandbox();
beforeEach(wipeMemoizeCache);
afterEach(sandbox.restore);

describe('func without arguments', () => {
  it('calls unmemoized func', async () => {
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func();

    expect(stub.calledOnce).toEqual(true);
  });

  it('calls memoized func once', async () => {
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func();
    await func();

    expect(stub.calledOnce).toEqual(true);
  });
});

describe('func with one arg', () => {
  it('calls unmemoized func', async () => {
    const arg = 42;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg)).toEqual(true);
  });

  it('calls memoized func once', async () => {
    const arg = 42;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg);
    await func(arg);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg)).toEqual(true);
  });

  it('handles multiple calls to funcs with different args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1);
    await func(arg2);

    expect(stub.calledTwice).toEqual(true);
    expect(stub.firstCall.calledWithExactly(arg1)).toEqual(true);
    expect(stub.secondCall.calledWithExactly(arg2)).toEqual(true);
  });
});

describe('func with multiple args', () => {
  it('calls unmemoized func', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg1, arg2)).toEqual(true);
  });

  it('calls memoized func once', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);
    await func(arg1, arg2);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg1, arg2)).toEqual(true);
  });

  it('handles multiple calls to funcs with different args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);
    await func(arg2, arg1);

    expect(stub.calledTwice).toEqual(true);
    expect(stub.firstCall.calledWithExactly(arg1, arg2)).toEqual(true);
    expect(stub.secondCall.calledWithExactly(arg2, arg1)).toEqual(true);
  });
});

describe('return value', () => {
  it('works for func without args', async () => {
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub);
    const result = await func();

    expect(stub.calledOnce).toEqual(true);
    expect(result).toEqual(42);
  });

  it('works for func with one arg', async () => {
    const arg = 1293847;
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub);
    const result = await func(arg);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg)).toEqual(true);
    expect(result).toEqual(42);
  });

  it('works for func with multiple args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub);
    const result = await func(arg1, arg2);

    expect(stub.calledOnce).toEqual(true);
    expect(stub.calledWithExactly(arg1, arg2)).toEqual(true);
    expect(result).toEqual(42);
  });
});
