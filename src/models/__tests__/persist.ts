import { createSandbox, assert } from 'sinon';
import AsyncStorage from '@react-native-community/async-storage';

import Persist from '../persist';

const Constants = {
  askEnablePush: 'com.shufflow.MindBlown.askEnablePush',
  usedPhrasesIdsKey: 'com.shufflow.MindBlown.usedPhrasesIds',
  visitedPhrasesIdsKey: 'com.shufflow.MindBlown.visitedPhrasesIds',
};

const sandbox = createSandbox();
let getItem: sinon.SinonStub;
let setItem: sinon.SinonStub;

beforeEach(() => {
  getItem = sandbox.stub(AsyncStorage, 'getItem');
  setItem = sandbox.stub(AsyncStorage, 'setItem');
});

afterEach(sandbox.restore);

describe('visited phrases', () => {
  let model: Persist;
  const ids = ['1', '2', '3', '4'];

  beforeEach(() => {
    getItem
      .withArgs(Constants.visitedPhrasesIdsKey)
      .resolves(JSON.stringify(ids));
    model = new Persist();
  });

  it('loads persisted items', async () => {
    const result = await model.getVisitedPhrases();

    expect(result).toEqual(new Set(ids));
  });

  it('get returns newly added id', async () => {
    await model.visitPhrase('5');
    const result = await model.getVisitedPhrases();

    expect(result).toEqual(new Set(ids.concat(['5'])));
  });

  it('persists a new id', async () => {
    await model.visitPhrase('5');

    assert.calledWithExactly(
      setItem,
      Constants.visitedPhrasesIdsKey,
      JSON.stringify(ids.concat(['5'])),
    );
  });
});

describe('used phrases', () => {
  let model: Persist;
  const ids = ['1', '2', '3', '4'];

  beforeEach(() => {
    getItem.withArgs(Constants.usedPhrasesIdsKey).resolves(JSON.stringify(ids));
    model = new Persist();
  });

  it('loads persisted items', async () => {
    const result = await model.getUsedPhrases();

    expect(result).toEqual(new Set(ids));
  });

  it('get returns newly added id', async () => {
    await model.usePhrase('5');
    const result = await model.getUsedPhrases();

    expect(result).toEqual(new Set(ids.concat(['5'])));
  });

  it('persists a new id', async () => {
    await model.usePhrase('5');

    assert.calledWithExactly(
      setItem,
      Constants.usedPhrasesIdsKey,
      JSON.stringify(ids.concat(['5'])),
    );
  });

  it('clears the used phrases', async () => {
    await model.clearUsedPhrases();

    assert.calledWithExactly(setItem, Constants.usedPhrasesIdsKey, '[]');
  });
});

describe('ask to enable push notifications', () => {
  let model: Persist;

  beforeEach(() => {
    model = new Persist();
  });

  it('returns true', async () => {
    getItem.withArgs(Constants.askEnablePush).resolves('true');

    const result = await model.didAskToEnablePushNotifications();

    expect(result).toBe(true);
  });

  it('returns false when unset', async () => {
    getItem.withArgs(Constants.askEnablePush).resolves(null);

    const result = await model.didAskToEnablePushNotifications();

    expect(result).toBe(false);
  });

  it('sets true', async () => {
    await model.setAskToEnablePushNotifications(true);

    assert.calledWithExactly(setItem, Constants.askEnablePush, 'true');
  });

  it('sets false', async () => {
    await model.setAskToEnablePushNotifications(false);

    assert.calledWithExactly(setItem, Constants.askEnablePush, 'false');
  });
});
