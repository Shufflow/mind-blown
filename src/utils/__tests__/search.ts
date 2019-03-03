import { createSandbox, assert } from 'sinon';

import { asyncBinarySearch } from '@utils/search';
import { wipeMemoizeCache } from '@utils/memoize';

const sandbox = createSandbox();
beforeEach(wipeMemoizeCache);
afterEach(sandbox.restore);

const compare = (desired: number) => async (elem: number) =>
  Promise.resolve(elem - desired);

it('searches an empty array', async () => {
  const comp = compare(0);

  const result = await asyncBinarySearch([], comp, undefined);

  expect(result).toBeUndefined();
});

describe('single element array', () => {
  it('finds an element', async () => {
    const comp = compare(0);

    const result = await asyncBinarySearch([0], comp, undefined);

    expect(result).toEqual(0);
  });

  it('finds the closest lower value', async () => {
    const comp = compare(0);

    const result = await asyncBinarySearch([1], comp, undefined);

    expect(result).toEqual(1);
  });
});

describe('context', () => {
  let comp: sinon.SinonStub;

  beforeEach(() => {
    comp = sandbox.stub();
  });

  it('is not called for empty array', async () => {
    await asyncBinarySearch([], comp, undefined);

    assert.notCalled(comp);
  });

  it('is undefined', async () => {
    await asyncBinarySearch([0], comp, undefined);

    assert.calledWithExactly(comp, 0, undefined);
  });

  it('receives the given context', async () => {
    const context = { foo: 'bar' };

    await asyncBinarySearch([0], comp, context);

    assert.calledWith(comp, 0, context);
  });
});

[
  { data: [10, 11, 12, 14], name: 'even' },
  { data: [100, 101, 102, 103, 110], name: 'odd' },
].forEach(({ data, name }) => {
  describe(`${name} length array`, () => {
    const min = Math.min(...data);
    const max = Math.max(...data);

    it('finds an element at the beginning of the array', async () => {
      const comp = compare(min);

      const result = await asyncBinarySearch(data, comp, undefined);

      expect(result).toEqual(min);
    });

    it('finds an element at the end of the array', async () => {
      const comp = compare(max);

      const result = await asyncBinarySearch(data, comp, undefined);

      expect(result).toEqual(max);
    });

    it('finds an element in the middle of the array', async () => {
      const comp = compare(data[2]);

      const result = await asyncBinarySearch(data, comp, undefined);

      expect(result).toEqual(data[2]);
    });

    it('finds the closes lower value', async () => {
      const des1 = max - 1;
      const exp1 = data[data.length - 2];

      const des2 = max + 10;
      const exp2 = max;

      const des3 = min - 5;
      const exp3 = min;

      [[des1, exp1], [des2, exp2], [des3, exp3]].forEach(
        async ([desired, expectedResult]) => {
          const comp = compare(desired);

          const result = await asyncBinarySearch(data, comp, undefined);

          expect(result).toEqual(expectedResult);
        },
      );
    });
  });
});

describe('whole search memoization', () => {
  let comp: sinon.SinonStub;

  beforeEach(() => {
    comp = sandbox.stub().callsFake(compare(0));
  });

  it('calls unmemoized searcn', async () => {
    const result = await asyncBinarySearch([0], comp, undefined);

    assert.calledOnce(comp);
    expect(result).toEqual(0);
  });

  it('calls memoized search once', async () => {
    const result1 = await asyncBinarySearch([0], comp, undefined);
    const result2 = await asyncBinarySearch([0], comp, undefined);

    assert.calledOnce(comp);
    expect(result1).toEqual(result2);
    expect(result1).toEqual(0);
  });

  it('calls multiple searches by context', async () => {
    const result1 = await asyncBinarySearch([0], comp, 'foo');
    const result2 = await asyncBinarySearch([0], comp, 'bar');

    assert.calledTwice(comp);
    expect(result1).toEqual(0);
    expect(result2).toEqual(0);
  });

  it('calls multiple searches with different results', async () => {
    const comp2 = sandbox.stub().callsFake(compare(3));

    const result1 = await asyncBinarySearch([0], comp, undefined);
    const result2 = await asyncBinarySearch([3], comp2, undefined);

    assert.calledOnce(comp);
    assert.calledOnce(comp2);
    expect(result1).toEqual(0);
    expect(result2).toEqual(3);
  });
});

describe('comparison memoization', () => {
  let comp: sinon.SinonStub;

  beforeEach(() => {
    comp = sandbox.stub().callsFake(compare(0));
  });

  it('calls unmemoized comparison', async () => {
    const result = await asyncBinarySearch([0], comp, undefined);

    assert.calledOnce(comp);
    expect(result).toEqual(0);
  });

  it('calls memoized comparison once', async () => {
    const result1 = await asyncBinarySearch([0], comp, undefined);
    const result2 = await asyncBinarySearch([-1, 0, 1], comp, undefined);

    assert.calledOnce(comp);
    expect(result1).toEqual(result2);
    expect(result1).toEqual(0);
  });

  it('calls multiple comparisons by context', async () => {
    const result1 = await asyncBinarySearch([0], comp, 'foo');
    const result2 = await asyncBinarySearch([0], comp, 'bar');

    assert.calledTwice(comp);
    expect(result1).toEqual(0);
    expect(result2).toEqual(0);
  });

  it('calls multiple comparisons with different results', async () => {
    const result = await asyncBinarySearch([0, 1, 2], comp, undefined);

    assert.calledTwice(comp);
    expect(result).toEqual(0);
  });
});
