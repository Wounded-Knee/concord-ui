import React from 'react';
import Waveform from '../components/Waveform';
import Overlay from '../components/Overlay';
import config from '../config';
const { colors } = config;

export default class MultiWaveform extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setInterval(() => {
      const { streams } = this.props;
      for (var x=0; x<streams.length; x++) {
        if (typeof(streams[x].tick) === 'function') {
          streams[x].tick();
        } else {
          console.warn(`${streams[x].user.username} has no tick callback`);
        }
      }
    }, 100);
  }

  render() {
    const {
      streams,
      height,
      width,
      callbackGenerator
    } = this.props;

    return (
      <>
        { streams.map(({ user }, i) =>
          <Waveform
            height={ height }
            width={ width }
            user={ user }
            registerCallbacks={ callbackGenerator(user) }
            color={ colors[streams.length - 1][i] }
          />
        ) }
        <Overlay
          height={ height }
          width={ width }
        />
      </>
    );
  }
}
