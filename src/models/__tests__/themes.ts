import { createSandbox } from 'sinon';

import colors from 'src/assets/colorPairs';

import * as themes from '../themes';

const { default: getColor, genIdx } = themes;

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

    expect(result).toEqual(colors.length);
  });
});

describe('color generation', () => {
  it('generates a random index when arg is undefined', () => {
    const fakeIdx = sandbox.stub(themes, 'genIdx').returns(0);

    getColor();

    expect(fakeIdx.called).toEqual(true);
  });

  it('uses the given idx', () => {
    const fakeIdx = sandbox.stub(themes, 'genIdx').returns(0);

    const result = getColor(0);

    expect(result).toEqual(colors[0]);
    expect(fakeIdx.called).toEqual(false);
  });

  it('generates a random idx if given is greater then colors length', () => {
    const fakeIdx = sandbox.stub(themes, 'genIdx').returns(0);
    const idx = colors.length;

    const result = getColor(idx);

    expect(result).toEqual(colors[0]);
    expect(fakeIdx.called).toEqual(true);
  });
});
