import { createSandbox } from 'sinon';
import { NativeModules } from 'react-native';
import knuthShuffle from 'knuth-shuffle';

import Fonts from '../fonts';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const mockFonts = ['a', 'b', 'c'];

beforeEach(() => {
  sandbox
    .stub(NativeModules.Fonts, 'getAvailableFonts')
    .resolves(mockFonts as any);
  sandbox.stub(knuthShuffle, 'knuthShuffle').callsFake(a => a.reverse());
});

it('gets a random font', async () => {
  sandbox.stub(Math, 'random').returns(0);

  const model = new Fonts();
  const result = await model.getRandomFont();

  expect(result).toEqual('c');
});

it('cycles through available fonts', async () => {
  const result = Object.assign({}, ...mockFonts.map(f => ({ [f]: 0 })));
  const model = new Fonts();

  for (let i = 0; i < mockFonts.length * 2; i += 1) {
    const font = await model.getRandomFont();
    result[font] += 1;
  }

  // each should have been repeated twice
  expect(Object.values(result)).toEqual([2, 2, 2]);
});
