import { AsyncStorage, Platform } from 'react-native';
import { createSandbox } from 'sinon';

import { getLocale, setLocale } from '../locale';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const LOCALE_KEY = 'LOCALE_KEY';

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn,
    setItem: jest.fn,
  },
  NativeModules: {
    I18nManager: { localeIdentifier: 'xpto' },
    SettingsManager: { settings: { AppleLanguages: ['foobar'] } },
  },
  Platform: {
    select: jest.fn,
  },
}));

describe('getting the locale', () => {
  it('gets from async storage', async () => {
    const asyncStorage = sandbox
      .stub(AsyncStorage, 'getItem')
      .resolves('foobar');
    const platform = sandbox.stub(Platform, 'select');

    const result = await getLocale();

    expect(result).toEqual('foobar');
    expect(asyncStorage.called).toEqual(true);
    expect(platform.called).toEqual(false);
  });

  it('gets from device if storage empty', async () => {
    const asyncStorage = sandbox.stub(AsyncStorage, 'getItem').resolves(null);
    const platform = sandbox.stub(Platform, 'select').returns(() => 'foobar');

    const result = await getLocale();

    expect(result).toEqual('foobar');
    expect(asyncStorage.called).toEqual(true);
    expect(platform.called).toEqual(true);
  });
});

describe('set locale', () => {
  it('sets to async storage', async () => {
    const asyncStorage = sandbox.stub(AsyncStorage, 'setItem').resolves();

    await setLocale('foobar');

    expect(asyncStorage.called).toEqual(true);
    expect(asyncStorage.calledWith(LOCALE_KEY, 'foobar')).toEqual(true);
  });
});
