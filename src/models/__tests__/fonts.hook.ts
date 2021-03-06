import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import { NativeModules } from 'react-native';
import lodash from 'lodash';
import RNTextSize from 'react-native-text-size';

import { useFonts } from '../fonts';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const mockFonts = ['a', 'b', 'c'];
let measure: sinon.SinonStub;

beforeEach(() => {
  sandbox
    .stub(NativeModules.Fonts, 'getAvailableFonts')
    .resolves([...mockFonts] as any);
  measure = sandbox
    .stub(RNTextSize, 'measure')
    .callsFake(async ({ fontSize }) =>
      Promise.resolve({
        height: fontSize! * 20,
      } as any),
    );
  sandbox.stub(lodash, 'shuffle').callsFake(a => a.reverse());
});

describe('get next font', () => {
  const renderHookWithSize = () => {
    const renderedHook = renderHook(useFonts);
    act(() => {
      renderedHook.result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { height: 100 } },
      } as any);
    });
    return renderedHook;
  };

  it('waits for size to be passed', () => {
    let resolved = false;
    const { result } = renderHook(useFonts);

    result.current.getNextFont('foobar').then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);
    assert.notCalled(measure);
  });

  it('cycles through fonts', async () => {
    const fontCount = Object.fromEntries(mockFonts.map(f => [f, 0]));
    const { result } = renderHookWithSize();

    for (let i = 0; i < mockFonts.length * 2; i += 1) {
      const font = await result.current.getNextFont('foobar');
      fontCount[font.fontFamily] += 1;

      expect(font.fontFamily).toEqual(
        mockFonts[mockFonts.length - 1 - (i % mockFonts.length)],
      );
    }

    // each should have been repeated twice
    expect(Object.values(fontCount)).toEqual([2, 2, 2]);
  });

  it('finds the font size that gets closer to the screen size', async () => {
    const { result } = renderHookWithSize();

    const font = await result.current.getNextFont('foobar');

    /**
     * The view's height is 100pt (defined in `renderHookWithSize`); The `measure`'s stub returns `fontSize * 20`
     * ergo, the fontSize for a 100pt screen is 5pt, in this test
     */
    expect(font.fontSize).toEqual(5);
  });
});
