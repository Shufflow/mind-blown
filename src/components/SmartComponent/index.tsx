import React from 'react';

export type SetState<Props, State> = <K extends keyof State>(
  state:
    | ((
        prevState: Readonly<State>,
        props: Readonly<Props>,
      ) => Pick<State, K> | State | null)
    | (Pick<State, K> | State | null),
  callback?: () => void,
) => void;

export class ViewModel<Props extends Object, State extends Object> {
  props: Props;
  getState: () => State;
  setState: SetState<Props, State>;

  constructor(
    props: Props,
    getState: () => State,
    setState: SetState<Props, State>,
  ) {
    this.props = props;
    this.getState = getState;
    this.setState = setState;
  }

  getInitialState = (props: Props): State => {
    // tslint:disable-next-line: no-console
    console.error("Don't call `super` for this method");
    return undefined as any;
  };
}

// tslint:disable-next-line: max-classes-per-file
class SmartComponent<
  Props extends {},
  State extends {},
  VM extends ViewModel<Props, State>
> extends React.Component<Props, State> {
  viewModel: VM;

  constructor(
    props: Props,
    Shaddow: new (
      props: Props,
      getState: () => State,
      setState: SetState<Props, State>,
    ) => VM,
  ) {
    super(props);

    this.viewModel = new Shaddow(props, () => this.state, this.setState);
    this.state = this.viewModel.getInitialState(props);
  }
}

export default SmartComponent;
