import { createSandbox } from 'sinon';

import RouteName from '@routes';
import sleep from '@utils/sleep';

import HomeViewModel, { SelectedThumb } from '../home';

const sandbox = createSandbox();
let viewModel: HomeViewModel;

beforeEach(() => {
  viewModel = new HomeViewModel({} as any, () => ({} as any), () => {});
});
afterEach(sandbox.restore);

describe('load phrase', () => {
  it('returns a random phrase', async () => {
    const phrase = { id: 'foo', en: 'xpto ' };
    const setState = sandbox.stub(viewModel, 'setState');
    sandbox.stub(viewModel.dataSource, 'getRandomPhrase').resolves(phrase);

    await viewModel.loadPhrase();

    expect(
      setState.calledWith({
        phrase,
        hasError: false,
        selectedThumb: null,
      } as any),
    ).toEqual(true);
  });

  it('suppresses errors as state', async () => {
    const setState = sandbox.stub(viewModel, 'setState');
    sandbox.stub(viewModel.dataSource, 'getRandomPhrase').rejects('fail');

    await viewModel.loadPhrase();

    expect(
      setState.calledWith({
        hasError: true,
      } as any),
    ).toEqual(true);
  });

  it('dispatches loading if request hangs', async () => {
    const setState = sandbox.stub(viewModel, 'setState');
    sandbox
      .stub(viewModel.dataSource, 'getRandomPhrase')
      .returns(sleep(300) as any);

    await viewModel.loadPhrase();

    expect(
      setState.calledWith({ hasError: false, phrase: null } as any),
    ).toEqual(true);
  });

  it('does not dispatch loading if request is fast', async () => {
    const phrase = { id: 'foo', en: 'xpto ' };
    const setState = sandbox.stub(viewModel, 'setState');
    sandbox.stub(viewModel.dataSource, 'getRandomPhrase').resolves(phrase);

    await viewModel.loadPhrase();

    expect(
      setState.calledWithMatch({
        phrase: null,
      } as any),
    ).toEqual(false);
  });
});

describe('get random phrase', () => {
  it('loads a random phrase', async () => {
    const phrase = { id: 'foo', en: 'xpto ' };
    const setState = sandbox.stub(viewModel, 'setState');
    sandbox.stub(viewModel.dataSource, 'getRandomPhrase').resolves(phrase);

    await viewModel.getRandomPhrase();

    expect(
      setState.calledWithMatch({
        phrase,
      } as any),
    ).toEqual(true);
  });

  it('dispatches new colors', async () => {
    const colors = {} as any;
    sandbox.stub(viewModel, 'genColors' as any).returns(colors);
    const setState = sandbox.stub(viewModel, 'setState');

    await viewModel.getRandomPhrase();

    expect(setState.calledWith(colors)).toEqual(true);
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
    sandbox.stub(viewModel, 'props').value({ locale });
    sandbox
      .stub(viewModel, 'getState')
      .returns({ phrase: { [locale]: 'bar' } } as any);

    const result = viewModel.getPhraseContent();

    expect(result).toEqual('bar');
  });

  it('returns english when locale is not found', () => {
    const locale = 'foo';
    sandbox.stub(viewModel, 'props').value({ locale });
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
    sandbox.stub(viewModel, 'props').value({ navigation: { navigate } });

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
