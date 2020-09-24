import React from 'react';
import Head from 'next/head';
import MultiWaveform from '../components/MultiWaveform';
import Websocket from 'react-websocket';
import config from '../config';
const { websocketUrl, height, width, visibleWidth } = config;
const hrtimeToBigint = hrtime => {
    if (!hrtime) throw new Error('hrtime: ' + hrtime);
    return hrtime[0] * 1000000 + hrtime[1] / 1000;
};
const timeToPx = ms => ms / 100000;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: []
    };
  }

  getStreamIndexByUser(user) {
    return this.state.streams.reduce(
      (acc, val, idx) =>
        val.user.id === user.id
          ? idx
          : acc
      , false
    );
  }

  registerCallbacks(user, callbacks) {
    const streamIndex = this.getStreamIndexByUser(user);
    const streams = [ ...this.state.streams ];
    streams[streamIndex].callbacks = callbacks;
    this.setState({
      streams: streams
    });
    return true;
  }

  processChunk(data) {
    const { streams } = this.state;
    var satisfied = false;

    for (var x=0; x<streams.length; x++) {
      if (streams[x].user.id === data.user.id) {
        streams[x].chunks.push(data);
        streams[x].callbacks.receive(data);
        satisfied = true;
      }
    }

    if (!satisfied) {
      streams.push({
        user: data.user,
        callbacks: {
          tick: () => {},
          receive: () => {}
        },
        chunks: [ data ]
      });
    }

    this.setState({
      ...this.state,
      streams: streams
    });
  }

  processFrames(data) {
    this.setState({
      ...this.state,
      frames: data
    });
  }

  onMessage(jsonString) {
    const data = JSON.parse(jsonString);

    // We receive multiple types of packets here,
    // so, identify & dispatch them here.
    if (data.length > 0) {
      const sample = data[0];
      if (sample.timeStart) {
        this.processFrames(data);
      }
    } else if (data.delightfulness) {
       this.processChunk(data);
    }
  }

  render() {
    const { streams, frames } = this.state;
    const callbackGenerator = user => this.registerCallbacks.bind(this, user);

    return (
      <>
        {
          streams.length ? <MultiWaveform
            streams={ streams }
            height={ height }
            width={ width }
            callbackGenerator={ callbackGenerator }
          /> : 'Waiting for streams...'
        }

        <dl>
          {
            this.state.streams.map(stream => <>
              <dt>{ stream.user.username }</dt>
              <dd>
                { stream.chunks.length } chunks
                <ul className="frames">
                  {
                    frames && false
                      ? frames.filter(
                          frame =>
                            frame.user.id === stream.user.id &&
                            frame.timeEnd
                        ).map(
                          frame => (
                            <li style={{
                              left: timeToPx(hrtimeToBigint(frame.timeStart)),
                              width: timeToPx(hrtimeToBigint(frame.timeEnd) - hrtimeToBigint(frame.timeStart))
                            }}></li>
                          )
                        )
                      : ''
                  }
                </ul>
              </dd>
            </>)
          }
        </dl>

        {
          typeof(WebSocket) !== 'undefined' ? (
            <Websocket
              url={ websocketUrl }
              onMessage={ this.onMessage.bind(this) }
            />
          ) : 'No websocket'
        }

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          div.canvas {
            overflow-x: auto;
            width: ${ visibleWidth }px;
            position: relative;
          }

          ul.frames {
            list-style-type: none;
            position: relative;
          }
          ul.frames li {
            height: 2px;
            background: #f00;
            display: block;
            position: absolute;
            top: 0;
          }

          dl {
            margin-top: -150px;
          }

          .waveform {
            position: absolute;
            top: 0;
            margin: 0;
            padding: 0;
            display: block;
            list-style-type: none;
            mix-blend-mode: difference;
            background: black;
          }
        `}</style>
      </>
    );
  }
}
