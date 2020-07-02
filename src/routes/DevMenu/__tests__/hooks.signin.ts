import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import { GoogleSignin } from '@react-native-community/google-signin';

import * as auth from 'src/models/auth';

import { useSignIn } from '../hooks';

const sandbox = createSandbox();
afterEach(sandbox.restore);

describe('mount', () => {
  describe('checks if signed in', () => {
    let isSignedIn: sinon.SinonStub;

    beforeEach(() => {
      isSignedIn = sandbox.stub(GoogleSignin, 'isSignedIn');
    });

    it('starts with loading true', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      expect(result.current.isLoading).toBe(true);

      await waitForNextUpdate();
    });

    it('is not signed in', async () => {
      isSignedIn.resolves(false);
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();

      expect(result.current.isSignedIn).toBe(false);
    });

    it('is signed in', async () => {
      isSignedIn.resolves(true);
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();

      expect(result.current.isSignedIn).toBe(true);
    });

    it('stops loading after check', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
    });

    it('returns error on failure', async () => {
      const err = new Error('error');
      isSignedIn.rejects(err);

      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();

      expect(result.current.error).toBe(err);
    });
  });
});

describe('handlers', () => {
  describe('press sign in', () => {
    let googleLogin: sinon.SinonStub;
    let isSignedIn: sinon.SinonStub;

    beforeEach(() => {
      googleLogin = sandbox.stub(auth, 'default').resolves();
      isSignedIn = sandbox
        .stub(GoogleSignin, 'isSignedIn')
        .onFirstCall()
        .resolves(false)
        .resolves(true);
    });

    it('starts loading immediately', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();

      await act(async () => {
        const signIn = result.current.handlePressSignIn();
        await waitForNextUpdate();

        expect(result.current.isLoading).toBe(true);
        await signIn;
      });
    });

    it('stops loading after response', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      isSignedIn.resetHistory();

      await act(async () => {
        await result.current.handlePressSignIn();
      });

      expect(result.current.isLoading).toBe(false);
      assert.callOrder(googleLogin, isSignedIn);
    });

    it('updates the state after success', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      isSignedIn.reset();
      isSignedIn.resolves(true);
      expect(result.current.isSignedIn).toBe(false);

      await act(async () => {
        await result.current.handlePressSignIn();
      });

      expect(result.current.isSignedIn).toBe(true);
      assert.callOrder(googleLogin, isSignedIn);
    });

    it('does not update flag on failure', async () => {
      const error = new Error('error');
      googleLogin.rejects(error);
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      isSignedIn.resetHistory();
      expect(result.current.isSignedIn).toBe(false);

      await act(async () => {
        await result.current.handlePressSignIn();
      });

      expect(result.current.isSignedIn).toBe(false);
      expect(result.current.error).toBe(error);
      assert.notCalled(isSignedIn);
    });
  });

  describe('press logout', () => {
    let signOut: sinon.SinonStub;
    let isSignedIn: sinon.SinonStub;

    beforeEach(() => {
      signOut = sandbox.stub(GoogleSignin, 'signOut');
      isSignedIn = sandbox.stub(GoogleSignin, 'isSignedIn');
      // .onFirstCall()
      // .resolves(false);
      // .resolves(true);
    });

    it('starts loading immediately', async () => {
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        const logout = result.current.handlePressLogout();
        await waitForNextUpdate();

        expect(result.current.isLoading).toBe(true);
        await logout;
      });

      assert.called(signOut);
    });

    it('stops loading and updates the state on success', async () => {
      isSignedIn
        .resolves(false)
        .onFirstCall()
        .resolves(true);
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      expect(result.current.isSignedIn).toBe(true);

      await act(async () => {
        const logout = result.current.handlePressLogout();
        await waitForNextUpdate();

        expect(result.current.isLoading).toBe(true);
        await logout;
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSignedIn).toBe(false);
      assert.callOrder(signOut, isSignedIn);
    });

    it('aborts and returns error on failure', async () => {
      const error = new Error('error');
      signOut.rejects(error);
      isSignedIn.resolves(true);
      const { result, waitForNextUpdate } = renderHook(useSignIn);

      await waitForNextUpdate();
      isSignedIn.resetHistory();

      assert.notCalled(signOut);
      assert.notCalled(isSignedIn);

      await act(async () => {
        await result.current.handlePressLogout();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSignedIn).toBe(true);
      expect(result.current.error).toBe(error);
      assert.called(signOut);
      assert.notCalled(isSignedIn);
    });
  });
});
