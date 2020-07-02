import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';

import RouteName from '@routes';

import Analytics from 'src/models/analytics';

import hook from '../hooks';

let initialProps: any;
const sandbox = createSandbox();
afterEach(sandbox.restore);

beforeEach(() => {
  initialProps = { navigation: {}, checkIsAdFree: () => {} };
});

describe('mount', () => {
  describe('analytics events', () => {
    let currScreen: sinon.SinonStub;

    beforeEach(() => {
      currScreen = sandbox.stub(Analytics, 'currentScreen');
    });

    it('registers current screen', async () => {
      const { waitForNextUpdate } = renderHook(hook, { initialProps });

      await waitForNextUpdate();

      assert.calledWithExactly(currScreen, RouteName.DevMenu);
    });
  });
});

describe('handlers', () => {
  describe('press moderate phrases', () => {
    const color = 'foobar';
    let navigate: sinon.SinonStub;
    beforeEach(() => {
      navigate = sandbox.stub();
      initialProps = {
        checkIsAdFree: () => {},
        navigation: { navigate, color },
      };
    });

    it('navigates to the correct route', async () => {
      const {
        result: {
          current: { handlePressModeratePhrases },
        },
      } = renderHook(hook, { initialProps });

      await act(async () => {
        handlePressModeratePhrases();
      });

      assert.calledWith(navigate, RouteName.ModeratePhrases);
    });

    it('sends the correct colors', async () => {
      const {
        result: {
          current: { handlePressModeratePhrases },
        },
      } = renderHook(hook, { initialProps });

      await act(async () => {
        handlePressModeratePhrases();
      });

      assert.calledWithMatch(navigate, RouteName.ModeratePhrases, color);
    });
  });

  describe('press crash', () => {
    it('throws an error', async () => {
      const {
        result: {
          current: { handlePressCrash },
        },
      } = renderHook(hook, { initialProps });

      try {
        await act(async () => {
          handlePressCrash();
        });

        fail('should have thrown exception');
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('press moderate suggestions', () => {
    let navigate: sinon.SinonStub;
    beforeEach(() => {
      navigate = sandbox.stub();
      initialProps = {
        checkIsAdFree: () => {},
        navigation: { navigate },
      };
    });

    it('navigates to the correct route', async () => {
      const {
        result: {
          current: { handlePressModerateSuggestions },
        },
      } = renderHook(hook, { initialProps });

      await act(async () => {
        handlePressModerateSuggestions();
      });

      assert.calledWith(navigate, RouteName.ModerateSuggestions);
    });
  });
});
