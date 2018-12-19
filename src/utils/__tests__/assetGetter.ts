import { createSandbox } from 'sinon';

import * as assets from '../assetGetter';

const mockAssets = [1, 2, 3, 4];
const getAsset = assets.default(mockAssets);
const genIdx = assets.genIdx(mockAssets);

const sandbox = createSandbox();
afterEach(sandbox.restore);

describe('index generation', () => {
  it('returns 0', () => {
    const rand = sandbox.stub(Math, 'random').returns(0);

    const result = genIdx();

    expect(result).toEqual(0);
    expect(rand.called).toEqual(true);
  });

  it('does not return greater than color lengh', () => {
    sandbox.stub(Math, 'random').returns(1);

    const result = genIdx();

    expect(result).toEqual(mockAssets.length);
  });
});

describe('color generation', () => {
  it('generates a random index when arg is undefined', () => {
    const fakeIdx = sandbox.stub(assets, 'genIdx').returns(() => 0);

    getAsset();

    expect(fakeIdx.called).toEqual(true);
  });

  it('uses the given idx', () => {
    const fakeIdx = sandbox.stub(assets, 'genIdx').returns(() => 0);

    const result = getAsset(0);

    expect(result).toEqual(mockAssets[0]);
    expect(fakeIdx.called).toEqual(false);
  });

  it('generates a random idx if given is greater then mockAssets length', () => {
    const fakeIdx = sandbox.stub(assets, 'genIdx').returns(() => 0);
    const idx = mockAssets.length;

    const result = getAsset(idx);

    expect(result).toEqual(mockAssets[0]);
    expect(fakeIdx.called).toEqual(true);
  });
});
