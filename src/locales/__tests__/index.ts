import { AsyncStorage } from 'react-native';
import { createSandbox } from 'sinon';
import i18n from 'i18n-js';

import { setupLocale, setLocale } from '..';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const LOCALE_KEY = 'LOCALE_KEY';

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn,
    setItem: jest.fn,
  },
}));

describe('setup locale', () => {
  it('sets from async storage is not empty', async () => {
    const asyncStorage = sandbox
      .stub(AsyncStorage, 'getItem')
      .resolves('foobar');

    await setupLocale();

    expect(i18n.locale).toEqual('foobar');
    expect(asyncStorage.called).toEqual(true);
  });

  it('does not set if async storage is empty', async () => {
    i18n.locale = 'foobar';
    const asyncStorage = sandbox.stub(AsyncStorage, 'getItem').resolves(null);

    await setupLocale();

    expect(i18n.locale).toEqual('foobar');
    expect(asyncStorage.called).toEqual(true);
  });
});

describe('set locale', () => {
  it('sets to async storage', async () => {
    const asyncStorage = sandbox.stub(AsyncStorage, 'setItem').resolves();

    await setLocale('foobar');

    expect(asyncStorage.called).toEqual(true);
    expect(asyncStorage.calledWith(LOCALE_KEY, 'foobar')).toEqual(true);
  });

  it('sets i18n locale', async () => {
    const stub = sandbox.stub(i18n);

    await setLocale('foobar');

    expect(stub.locale).toEqual('foobar');
  });
});
