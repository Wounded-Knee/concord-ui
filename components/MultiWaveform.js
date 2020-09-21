import React from 'react';
import Waveform from '../components/Waveform';
import config from '../config';
const { colors } = config;

export default class MultiWaveform extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      streams,
      callbackGenerator
    } = this.props;

    return (
      <>
        {
          streams.map(({ user }, i) =>
            <Waveform
              user={ user }
              registerCallbacks={ callbackGenerator(user) }
              color={ colors[streams.length - 1][i] }
            />
          )
        }
      </>
    );
  }
}
