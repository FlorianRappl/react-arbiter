import * as React from 'react';
import { withStasis, StasisProps } from '../src';

interface ExternalComponentProps {
  timeout: number;
}

class ExternalComponent extends React.Component<ExternalComponentProps> {
  private timeoutId: any;
  state = {
    crashing: false,
  };

  componentDidMount() {
    const { timeout } = this.props;
    this.timeoutId = setTimeout(() => this.setState({ crashing: true }), timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  render() {
    const { crashing } = this.state;

    if (crashing) {
      throw new Error('I have crashed!');
    }

    return <b>I will crash in 2 seconds.</b>;
  }
}

const ErrorDisplay: React.SFC<StasisProps & { text: string }> = ({ error, text }) => (
  <div>
    {text} <b>{error}</b>!
  </div>
);

const StasisField = withStasis(ErrorDisplay);

export default () => (
  <StasisField text="The seen error was">
    <ExternalComponent timeout={2000} />
  </StasisField>
);
