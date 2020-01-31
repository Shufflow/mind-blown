import { createSandbox, assert } from 'sinon';
import * as analytics from '@react-native-firebase/analytics';

import RouteName from '@routes';

import Analytics from '../analytics';

const sandbox = createSandbox();
let logEvent: sinon.SinonStub;
let currentScreen: sinon.SinonStub;

afterEach(sandbox.restore);

beforeEach(() => {
  logEvent = sandbox.stub().resolves();
  currentScreen = sandbox.stub().resolves();
  sandbox
    .stub(analytics, 'default')
    .callsFake(() => ({ logEvent, setCurrentScreen: currentScreen } as any));
});

describe('app rating', () => {
  it('logs the correct event', async () => {
    await Analytics.appRating();

    assert.calledWithExactly(logEvent, 'app_rating');
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.appRating();

    expect(result).rejects.toBe(error);
  });
});

describe('current screen', () => {
  it('logs the correct event', async () => {
    await Analytics.currentScreen(RouteName.About);

    assert.calledWithExactly(currentScreen, RouteName.About);
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.currentScreen(RouteName.About);

    expect(result).rejects.toBe(error);
  });
});

describe('review phrase', () => {
  const id = 'id';
  const review = true;
  it('logs the correct event', async () => {
    await Analytics.reviewPhrase(id, review);

    assert.calledWithExactly(logEvent, 'review_phrase', { id, review });
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.reviewPhrase(id, review);

    expect(result).rejects.toBe(error);
  });
});

describe('select author', () => {
  it('logs the correct event', async () => {
    await Analytics.selectAuthor();

    assert.calledWithExactly(logEvent, 'select_author');
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.selectAuthor();

    expect(result).rejects.toBe(error);
  });
});

describe('select designer', () => {
  it('logs the correct event', async () => {
    await Analytics.selectDesigner();

    assert.calledWithExactly(logEvent, 'select_designer');
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.selectDesigner();

    expect(result).rejects.toBe(error);
  });
});

describe('select language', () => {
  const lang = 'pt-BR';

  it('logs the correct event', async () => {
    await Analytics.selectLanguage(lang);

    assert.calledWithExactly(logEvent, 'select_lang', { lang });
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.selectLanguage(lang);

    expect(result).rejects.toBe(error);
  });
});

describe('sent suggestion', () => {
  const id = 'id';

  it('logs the correct event', async () => {
    await Analytics.sentSuggestion(id);

    assert.calledWithExactly(logEvent, 'sent_suggestion', { id });
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.sentSuggestion(id);

    expect(result).rejects.toBe(error);
  });
});

describe('share phrase', () => {
  const id = 'id';
  const medium = 'medium';

  it('logs the correct event', async () => {
    await Analytics.sharePhrase(id, medium);

    assert.calledWithExactly(logEvent, 'share_phrase', { id, medium });
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.sharePhrase(id, medium);

    expect(result).rejects.toBe(error);
  });
});

describe('view phrase', () => {
  const id = 'id';

  it('logs the correct event', async () => {
    await Analytics.viewPhrase(id);

    assert.calledWithExactly(logEvent, 'view_phrase', { id });
  });

  it('forwards errors', async () => {
    const error = new Error('err');

    const result = Analytics.viewPhrase(id);

    expect(result).rejects.toBe(error);
  });
});
