import React from 'react';

export class ViewModel<Props extends Object, State extends Object> {
  props: Props;
  getState: () => State;
  setState: (state: State) => void;

  constructor(
    props: Props,
    getState: () => State,
    setState: (state: State) => void,
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
      setState: (state: State) => void,
    ) => VM,
  ) {
    super(props);

    this.viewModel = new Shaddow(
      props,
      () => this.state,
      state => {
        this.setState(state);
      },
    );

    this.state = this.viewModel.getInitialState(props);
  }
}

export default SmartComponent;
