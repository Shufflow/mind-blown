import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';

import RouteName from '@routes';
import * as useLocale from '@hocs/withLocale';

import Analytics from 'src/models/analytics';

import hook from '..';
// import * as hooks from '../ads';
// const { buyAdFree } = hooks;

const sandbox = createSandbox();
afterEach(sandbox.restore);

let navigate: sinon.SinonStub;
let initialProps: any;

beforeEach(() => {
  navigate = sandbox.stub();
  initialProps = { navitation: { navigate } };
});

it('sets the screen on mount', () => {
  const setScreen = sandbox.stub(Analytics, 'currentScreen');

  renderHook(hook, { initialProps });

  assert.calledWithExactly(setScreen, RouteName.Settings);
});

it('handles navigation', () => {
  const routeName: any = 'foobar';
  const color = 'xpto';
  const { result } = renderHook(hook, {
    initialProps: { navigation: { navigate, color } } as any,
  });

  act(result.current.handleNavigate(routeName));

  assert.calledWithExactly(navigate, routeName, color);
});

describe('handle set locale', () => {
  const locale = 'foobar';
  let setParams: sinon.SinonStub;
  let setLocale: sinon.SinonStub;

  beforeEach(() => {
    setParams = sandbox.stub();
    setLocale = sandbox.stub();
    initialProps = { navigation: { setParams } };

    sandbox.stub(useLocale, 'useLocale').returns({ setLocale } as any);
  });

  it('updates the context', () => {
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(setLocale, locale);
  });

  it('updates the navigation params', () => {
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(setParams, { updateLocale: '' });
  });

  it('logs the event', () => {
    const event = sandbox.stub(Analytics, 'selectLanguage');
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(event, locale);
  });
});
