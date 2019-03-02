import { createSandbox, assert } from 'sinon';

import memoize, { wipeMemoizeCache } from '../memoize';

const sandbox = createSandbox();
beforeEach(wipeMemoizeCache);
afterEach(sandbox.restore);

describe('func without arguments', () => {
  it('calls unmemoized func', async () => {
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func();

    assert.calledOnce(stub);
  });

  it('calls memoized func once', async () => {
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func();
    await func();

    assert.calledOnce(stub);
  });
});

describe('func with one arg', () => {
  it('calls unmemoized func', async () => {
    const arg = 42;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg);
  });

  it('calls memoized func once', async () => {
    const arg = 42;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg);
    await func(arg);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg);
  });

  it('handles multiple calls to funcs with different args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1);
    await func(arg2);

    assert.calledTwice(stub);
    assert.calledWithExactly(stub.firstCall, arg1);
    assert.calledWithExactly(stub.secondCall, arg2);
  });
});

describe('func with multiple args', () => {
  it('calls unmemoized func', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg1, arg2);
  });

  it('calls memoized func once', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);
    await func(arg1, arg2);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg1, arg2);
  });

  it('handles multiple calls to funcs with different args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves();

    const func = memoize(stub);
    await func(arg1, arg2);
    await func(arg2, arg1);

    assert.calledTwice(stub);
    assert.calledWithExactly(stub.firstCall, arg1, arg2);
    assert.calledWithExactly(stub.secondCall, arg2, arg1);
  });
});

describe('return value', () => {
  it('works for func without args', async () => {
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub as () => Promise<number>);
    const result = await func();

    assert.calledOnce(stub);
    expect(result).toEqual(42);
  });

  it('works for func with one arg', async () => {
    const arg = 1293847;
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub as (arg: number) => Promise<number>);
    const result = await func(arg);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg);
    expect(result).toEqual(42);
  });

  it('works for func with multiple args', async () => {
    const arg1 = 42;
    const arg2 = 1293847;
    const stub = sandbox.stub().resolves(42);

    const func = memoize(stub as (
      arg1: number,
      arg2: number,
    ) => Promise<number>);
    const result = await func(arg1, arg2);

    assert.calledOnce(stub);
    assert.calledWithExactly(stub, arg1, arg2);
    expect(result).toEqual(42);
  });
});
