import React from 'react';
import Head from 'next/head';
import MultiWaveform from '../components/MultiWaveform';
import Websocket from 'react-websocket';
import config from '../config';
const { websocketUrl } = config;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: []
    };
  }

  componentDidMount() {
    setInterval(() => {
      const { streams } = this.state;
      for (var x=0; x<streams.length; x++) {
        if (typeof(streams[x].tick) === 'function') {
          streams[x].tick();
        } else {
          console.warn(`${streams[x].user.username} has no tick callback`);
        }
      }
    }, 100);
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

  onMessage(jsonString) {
    const data = JSON.parse(jsonString);
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

  render() {
    const { streams } = this.state;
    return (
      <div id="useless">
        {
          streams.length ? <MultiWaveform
            streams={ streams }
            callbackGenerator={ user => this.registerCallbacks.bind(this, user) }
          /> : 'Waiting for streams...'
        }

        <dl>
          {
            this.state.streams.map(stream => <>
              <dt>{ stream.user.username }</dt>
              <dd>
                { stream.chunks.length } chunks
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

          dl {
            margin-top: 150px;
          }

          .waveform {
            margin: 0;
            padding: 0;
            position: absolute;
            top: 0;
            display: block;
            height: 100px;
            width: 500px;
            list-style-type: none;
            mix-blend-mode: difference;
            background: black;
          }
        `}</style>
      </div>
    );
  }
}
