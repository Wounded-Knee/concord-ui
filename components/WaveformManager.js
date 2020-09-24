import React from 'react';
import Waveform from './Waveform2';
import config from '../config';
const { colors } = config;

export default class MultiWaveform extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      streams,
      height,
      width,
      className
    } = this.props;
    const colorSet = colors[streams.length - 1];

    return (
      <div className="waveformManager">
        { streams.map((stream, i) =>
          <Waveform
            { ...this.props }
            key={ i }
            streams={ undefined }
            stream={ stream }
            color={ colorSet[i] }
          />
        ) }

        <style jsx global>{`
          .waveformManager {
            position: relative;
          }
        `}</style>
      </div>
    );
  }
}
