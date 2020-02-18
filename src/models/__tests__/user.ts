import { createSandbox, assert } from 'sinon';
import MockFirebase from 'mock-cloud-firestore';
import firebase from 'firebase';
import * as messaging from '@react-native-firebase/messaging';

import { stubFirebase } from '@utils/tests';

import Model from '../user';

const sandbox = createSandbox();
afterEach(sandbox.restore);
jest.unmock('firebase');

let currentUser: sinon.SinonStub;
let firestore: sinon.SinonStub;

beforeEach(() => {
  currentUser = sandbox
    .stub(firebase, 'auth')
    .returns({ currentUser: { uid: '0' } } as any);
  firestore = sandbox.stub(firebase, 'firestore').returns(
    new MockFirebase(
      stubFirebase({
        users: [{ id: '0', isPushEnabled: true }],
      }),
    ).firestore(),
  );
});

describe('is push enabled', () => {
  it('is not signed in', async () => {
    currentUser.returns({ currentUser: null });

    const result = await Model.isPushEnabled();

    expect(result).toBe(false);
  });

  it('user does not exist', async () => {
    currentUser.returns({ currentUser: { uid: 'foobar' } });

    const result = await Model.isPushEnabled();

    expect(result).toBe(false);
  });

  it('has push enabled', async () => {
    currentUser.returns({ currentUser: { uid: '0' } });

    const result = await Model.isPushEnabled();

    expect(result).toBe(true);
  });
});

describe('set push enabled', () => {
  const locale = 'xpto';
  let collection: sinon.SinonStub;
  let doc: sinon.SinonStub;
  let set: sinon.SinonStub;
  let update: sinon.SinonStub;
  let subscribe: sinon.SinonStub;
  let unsubscribe: sinon.SinonStub;
  let register: sinon.SinonStub;
  let unregister: sinon.SinonStub;
  let getToken: sinon.SinonStub;

  beforeEach(() => {
    set = sandbox.stub();
    update = sandbox.stub();
    doc = sandbox.stub().returns({ set, update });
    collection = sandbox.stub().returns({ doc });
    subscribe = sandbox.stub();
    unsubscribe = sandbox.stub();
    register = sandbox.stub();
    unregister = sandbox.stub();
    getToken = sandbox.stub();

    firestore.returns({ collection } as any);
    sandbox.stub(messaging, 'default').returns({
      getToken,
      registerForRemoteNotifications: register,
      subscribeToTopic: subscribe,
      unregisterForRemoteNotifications: unregister,
      unsubscribeFromTopic: unsubscribe,
    } as any);
  });

  describe('disabling notifications', () => {
    it('is not signed in', async () => {
      currentUser.returns({ currentUser: null });

      const result = await Model.setPushEnabled(false, locale);

      expect(result).toBe(false);
      assert.notCalled(subscribe);
      assert.notCalled(unsubscribe);
      assert.notCalled(register);
      assert.notCalled(unregister);
      assert.notCalled(set);
    });

    it('creates value for non-existent user', async () => {
      currentUser.returns({ currentUser: { uid: 'foobar' } });

      const result = await Model.setPushEnabled(false, locale);

      expect(result).toBe(true);
      assert.calledWithExactly(collection, 'users');
      assert.calledWithExactly(doc, 'foobar');
      assert.calledWith(set, { isPushEnabled: false }, { merge: true });
    });

    it('sets the given value', async () => {
      const result = await Model.setPushEnabled(false, locale);

      expect(result).toBe(true);
      assert.calledWithExactly(collection, 'users');
      assert.calledWithExactly(doc, '0');
      assert.calledWithExactly(set, { isPushEnabled: false }, { merge: true });
    });

    it('unsubscribes from the given topic when disabling', async () => {
      await Model.setPushEnabled(false, locale);

      assert.calledWithExactly(unsubscribe, locale);
      assert.notCalled(subscribe);
    });

    it('unregisters for remove notifications when disabling', async () => {
      await Model.setPushEnabled(false, locale);

      assert.calledOnce(unregister);
      assert.notCalled(register);
    });

    it('does not save the users token', async () => {
      await Model.setPushEnabled(false, locale);

      assert.notCalled(update);
      assert.notCalled(getToken);
    });
  });

  describe('enabling notifications', () => {
    const apnsToken = 'token';

    beforeEach(() => {
      getToken.resolves(apnsToken);
    });

    it('is not signed in', async () => {
      currentUser.returns({ currentUser: null });

      const result = await Model.setPushEnabled(true, locale);

      expect(result).toBe(false);
      assert.notCalled(subscribe);
      assert.notCalled(unsubscribe);
      assert.notCalled(register);
      assert.notCalled(unregister);
      assert.notCalled(set);
    });

    it('creates value for non-existent user', async () => {
      currentUser.returns({ currentUser: { uid: 'foobar' } });

      const result = await Model.setPushEnabled(true, locale);

      expect(result).toBe(true);
      assert.calledWithExactly(collection, 'users');
      assert.calledWithExactly(doc, 'foobar');
      assert.calledWith(set, { isPushEnabled: true }, { merge: true });
    });

    it('sets the given value', async () => {
      currentUser.returns({ currentUser: { uid: '0' } });

      const result = await Model.setPushEnabled(true, locale);

      expect(result).toBe(true);
      assert.calledWithExactly(collection, 'users');
      assert.calledWithExactly(doc, '0');
      assert.calledWithExactly(set, { isPushEnabled: true }, { merge: true });
    });

    it('subscribes from the given topic when disabling', async () => {
      currentUser.returns({ currentUser: { uid: '0' } });

      await Model.setPushEnabled(true, locale);

      assert.calledWithExactly(subscribe, locale);
      assert.notCalled(unsubscribe);
    });

    it('registers for remove notifications when disabling', async () => {
      currentUser.returns({ currentUser: { uid: '0' } });

      await Model.setPushEnabled(true, locale);

      assert.calledOnce(register);
      assert.notCalled(unregister);
    });

    it('saves the current users APNS token', async () => {
      await Model.setPushEnabled(true, locale);

      assert.calledOnce(getToken);
      assert.calledWithExactly(update, { apnsToken });
    });
  });
});

describe('sign in', () => {
  it('calls anonymous signin', async () => {
    const signIn = sandbox.stub();
    currentUser.returns({
      signInAnonymously: signIn,
    } as any);

    await Model.signIn();

    assert.called(signIn);
  });

  it('throws any errors', async () => {
    const error = new Error('error');
    currentUser.returns({
      signInAnonymously: sandbox.stub().rejects(error),
    });

    const result = Model.signIn();

    return expect(result).rejects.toBe(error);
  });
});
