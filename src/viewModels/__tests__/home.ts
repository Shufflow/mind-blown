import { createSandbox, assert } from 'sinon';
import { first } from 'rxjs/operators';
import Share from 'react-native-share';

import RouteName from '@routes';
import sleep from '@utils/sleep';

import HomeViewModel, { SelectedThumb } from '../home';

const sandbox = createSandbox();
let viewModel: HomeViewModel;

beforeEach(() => {
  viewModel = new HomeViewModel(() => ({} as any), () => ({} as any), () => {});
  viewModel.handlePhraseContainerSize({ height: 100, width: 100 });
});
afterEach(sandbox.restore);

describe('get random phrase', () => {
  const phrase = { id: 'foo', en: 'xpto' };
  let random: sinon.SinonStub;

  beforeEach(() => {
    random = sandbox.stub(viewModel.dataSource, 'getRandomPhrase');
  });

  it('returns a random phrase', async () => {
    random.resolves(phrase);

    viewModel.getRandomPhrase();
    const result = await viewModel.phraseSubject.pipe(first()).toPromise();

    expect(result).toEqual(phrase);
  });

  it('suppresses errors as state', async () => {
    const setState = sandbox.stub(viewModel, 'setState');
    random.rejects('fail');

    await viewModel.getRandomPhrase();

    expect(
      setState.calledWith({
        hasError: true,
      } as any),
    ).toEqual(true);
  });

  it('dispatches loading if request hangs', async () => {
    const setState = sandbox.stub(viewModel, 'setState');
    random.returns(sleep(300) as any);

    await viewModel.getRandomPhrase();

    expect(
      setState.calledWith({ hasError: false, phrase: null } as any),
    ).toEqual(true);
  });

  it('does not dispatch loading if request is fast', async () => {
    const setState = sandbox.stub(viewModel, 'setState');
    random.resolves(phrase);

    await viewModel.getRandomPhrase();

    expect(
      setState.calledWithMatch({
        phrase: null,
      } as any),
    ).toEqual(false);
  });

  it('dispatches new colors', async () => {
    const colors = { bgColor: 'foo', fgColor: 'bar' } as any;
    sandbox.stub(viewModel, 'genColors' as any).returns(colors);

    viewModel.getRandomPhrase();
    const result = await viewModel.stateObservable.pipe(first()).toPromise();

    expect(result).toMatchObject(colors);
  });
});

describe('get phrase content', () => {
  it('has no phrase', () => {
    sandbox.stub(viewModel, 'getState').returns({ phrase: null } as any);

    const result = viewModel.getPhraseContent();

    expect(result).toEqual('');
  });

  it('returns a phrase with the props locale', () => {
    const locale = 'foo';
    sandbox.stub(viewModel, 'getProps').returns({ locale } as any);
    sandbox
      .stub(viewModel, 'getState')
      .returns({ phrase: { [locale]: 'bar' } } as any);

    const result = viewModel.getPhraseContent();

    expect(result).toEqual('bar');
  });

  it('returns english when locale is not found', () => {
    const locale = 'foo';
    sandbox.stub(viewModel, 'getProps').returns({ locale } as any);
    sandbox
      .stub(viewModel, 'getState')
      .returns({ phrase: { en: 'bar' } } as any);

    const result = viewModel.getPhraseContent();

    expect(result).toEqual('bar');
  });
});

describe('handle press settings', () => {
  it('navigates to settings screen', () => {
    const navigate = sandbox.stub();
    sandbox
      .stub(viewModel, 'getProps')
      .returns({ navigation: { navigate } } as any);

    viewModel.handlePressSettings();

    expect(navigate.calledWith(RouteName.Settings)).toEqual(true);
  });
});

describe('handle press review', () => {
  it('aborts when phrase is null', async () => {
    const review = sandbox.stub(viewModel.dataSource, 'reviewPhrase');
    sandbox.stub(viewModel, 'getState').returns({ phrase: null } as any);

    await viewModel.handlePressReview(true)();

    expect(review.called).toEqual(false);
  });

  it('dispatches thumb up when positive', async () => {
    sandbox.stub(viewModel.dataSource, 'reviewPhrase').resolves();
    sandbox.stub(viewModel, 'getState').returns({ phrase: {} } as any);
    const setState = sandbox.stub(viewModel, 'setState');

    await viewModel.handlePressReview(true)();

    expect(
      setState.calledWith({
        selectedThumb: SelectedThumb.Up,
      } as any),
    ).toEqual(true);
  });

  it('dispatches thumb down when positive', async () => {
    sandbox.stub(viewModel.dataSource, 'reviewPhrase').resolves();
    sandbox.stub(viewModel, 'getState').returns({ phrase: {} } as any);
    const setState = sandbox.stub(viewModel, 'setState');

    await viewModel.handlePressReview(false)();

    expect(
      setState.calledWith({
        selectedThumb: SelectedThumb.Down,
      } as any),
    ).toEqual(true);
  });

  it('reviews a phrase', async () => {
    const phrase = { id: 'foo' };
    const review = sandbox.stub(viewModel.dataSource, 'reviewPhrase');
    sandbox.stub(viewModel, 'getState').returns({ phrase } as any);

    await viewModel.handlePressReview(true)();

    expect(review.calledWith(phrase.id, true)).toEqual(true);
  });

  it('suppress error as state dispatch', async () => {
    sandbox.stub(viewModel.dataSource, 'reviewPhrase').rejects();
    sandbox.stub(viewModel, 'getState').returns({ phrase: {} } as any);
    const setState = sandbox.stub(viewModel, 'setState');

    await viewModel.handlePressReview(true)();

    expect(setState.calledWith({ selectedThumb: null } as any)).toEqual(true);
  });
});

describe('handle view shot ref', () => {
  it('sets valid values', () => {
    const ref: any = 'foobar';

    viewModel.handleViewShotRef(ref);

    expect(viewModel.viewShot).toEqual(ref);
  });

  it('does not reset with invalid value', () => {
    const ref: any = 'foobar';

    viewModel.handleViewShotRef(ref);
    viewModel.handleViewShotRef(null);

    expect(viewModel.viewShot).toEqual(ref);
  });
});

describe('handle press share', () => {
  let capture: sinon.SinonStub;
  let share: sinon.SinonStub;

  beforeEach(() => {
    capture = sandbox.stub();
    share = sandbox.stub(Share, 'open').resolves();
  });

  it('does nothing if viewShot is undefined', async () => {
    await viewModel.handlePressShare();

    assert.notCalled(share);
  });

  it('does nothing if capture is invalid', async () => {
    viewModel.handleViewShotRef({ capture: undefined } as any);

    await viewModel.handlePressShare();

    assert.notCalled(share);
  });

  it('shares the returned url', async () => {
    viewModel.handleViewShotRef({ capture } as any);

    const url = 'foobar';
    capture.returns(url);

    await viewModel.handlePressShare();

    assert.calledWith(share, {
      type: 'image/png',
      url: `file://${url}`,
    });
  });

  it('suppresses errors', async () => {
    capture.rejects('error');

    try {
      await viewModel.handlePressShare();

      assert.notCalled(share);
    } catch (e) {
      fail(e);
    }
  });
});
