import React from 'react';
import Head from 'next/head';
import Scroller from '../components/Scroller';
import WaveformManager from '../components/WaveformManager';
import Websocket from 'react-websocket';
import config from '../config';
const { websocketUrl, height, width, visibleWidth } = config;
const fakeUsers = [1,2,3];
var chunkCount = 0;
const timers = [];

export default class Dev extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secs: 0,
      streams: {}
    };
  }

  componentDidMount() {
    timers.push(setInterval(this.tick.bind(this), 1000));
  }

  componentWillUnmount() {
    timers.map(timer => clearInterval(timer));
  }

  receive(newChunk) {
    const user = newChunk.user.id;
    const userStream = this.state.streams[user] || [];
    chunkCount++;

    this.setState((state) => ({
      streams: {
        ...state.streams,
        [user]: [
          ...state.streams[user] || [],
          newChunk
        ]
      },
      chunkCount: chunkCount
    }));
  }

  tick() {
    this.setState((state) => ({
      secs: state.secs + 1
    }));
  }

  makeChunk() {
    return {
      user: fakeUsers[Math.floor(Math.random()*fakeUsers.length)],
      time: [
        this.state.secs,
        Math.floor((Math.random() * 900541512) + 1)
      ],
      delightfulness: Math.floor((Math.random() * 100) + 1)
    };
  }

  getStreams() {
    return Object.keys(this.state.streams).map(user => this.state.streams[user]);
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
       this.receive(data);
    }
  }

  processFrames(data) {
    this.setState({
      ...this.state,
      frames: data
    });
  }

  render() {
    return (
      <>
        <Scroller height={ height } width={ visibleWidth } secs={ this.state.secs }>
          <WaveformManager
            streams={ this.getStreams() }
            height={ height }
            width={ width }
            secs={ this.state.secs }
          />
        </Scroller>

        <p>Secs: { this.state.secs }</p>
        <p>Streams: { this.getStreams().length }</p>
        <p>Chunks: { chunkCount }</p>

        {
          typeof(WebSocket) !== 'undefined' ? (
            <Websocket
              url={ websocketUrl }
              onMessage={ this.onMessage.bind(this) }
            />
          ) : 'No websocket'
        }
      </>
    );
  }
}
