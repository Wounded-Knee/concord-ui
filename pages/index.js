import React from 'react';
import Head from 'next/head';
import Scroller from '../components/Scroller';
import WaveformManager from '../components/WaveformManager';
import Websocket from 'react-websocket';
import config from '../config';
import { getHexColor } from '../util';
const { websocketUrl, height, width, visibleWidth, colors } = config;
const fakeUsers = [1,2,3];
var chunkCount = 0;
const timers = [];

export default class Dev extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secs: 0,
      streams: {},
      users: {},
      frames: [],
      errors: [],
      messages: []
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
      users: {
        ...state.users,
        [user]: newChunk.user
      },
      chunkCount: chunkCount
    }));
  }

  tick() {
    this.setState((state) => ({
      secs: state.secs + 1
    }));
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
    } else if (data.error) {
      this.setState(state => ({
        ...state,
        errors: [
          ...state.errors,
          data.error
        ]
      }));
      console.error('Error: ', data.error);
    } else if (data.message) {
      this.setState(state => ({
        ...state,
        messages: [
          ...state.messages,
          data.message
        ]
      }));
      console.log('Message: ', data.message);
    }
  }

  processFrames(data) {
    this.setState(state => ({
      ...state,
      frames: data
    }));
  }

  render() {
    const {
      errors,
      messages,
      frames,
      secs,
      users
    } = this.state;
    const streams = this.getStreams();

    return (
      <>
        <Scroller height={ height } width={ visibleWidth } secs={ secs }>
          <WaveformManager
            streams={ streams }
            height={ height }
            width={ width }
            secs={ secs }
          />
        </Scroller>

        { streams.map((stream, i) => {
            const userId = Object.keys(this.state.streams)[i];
            return (<span style={{
              background: getHexColor(colors[streams.length-1][i])
            }}>{ users[userId].username }</span>);
        }) }

        <p>Secs: { secs }</p>
        <p>Streams: { streams.length }</p>
        <p>Chunks: { chunkCount }</p>
        <p>Errors: { errors.length }</p>
        <p>Messages: { messages.length }</p>
        <p>Frames: { frames.length } total, { frames.filter(frame => frame.data.disruptive).length } disruptive</p>

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
