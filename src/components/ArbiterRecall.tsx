import * as React from 'react';
import { isfunc } from '../utils';
import { asyncStrategy, standardStrategy } from '../strategies';
import { ArbiterModule, ArbiterDisplay, ArbiterOptions } from '../types';

export interface ArbiterRecallProps<TApi> extends ArbiterOptions<TApi> {
  /**
   * The component to render when the modules have been loaded
   * (node instance) or with the state of the recall (function).
   */
  children?: React.ReactChild | ArbiterDisplay<TApi>;
}

export interface ArbiterState<TApi> {
  loaded: boolean;
  error?: any;
  modules: Array<ArbiterModule<TApi>>;
}

/**
 * Represents an arbiter recall component to load extension components.
 */
export class ArbiterRecall<TApi> extends React.Component<ArbiterRecallProps<TApi>, ArbiterState<TApi>> {
  private mounted = false;

  constructor(props: ArbiterRecallProps<TApi>) {
    super(props);
    this.state = {
      loaded: false,
      modules: [],
    };
  }

  private setLoaded = () => this.mounted && this.setState({ loaded: true });

  private setModules = (error: any, modules: Array<ArbiterModule<TApi>>) =>
    this.mounted &&
    this.setState({
      error,
      modules,
    });

  componentDidMount() {
    const { async, strategy = async ? asyncStrategy : standardStrategy, ...options } = this.props;
    this.mounted = true;
    strategy(options, this.setModules).then(this.setLoaded, this.setLoaded);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { children } = this.props;
    const { loaded, modules, error } = this.state;

    if (isfunc(children)) {
      return (children as ArbiterDisplay<TApi>)(loaded, modules, error);
    } else if (loaded) {
      return children;
    }

    return false;
  }
}
