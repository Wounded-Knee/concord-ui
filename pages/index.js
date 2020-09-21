import Head from 'next/head';
import Waveform from '../components/Waveform';
import Websocket from 'react-websocket';
const websocketUrl = "ws://localhost:8080/";
const streamCount = 3;
const colors = [
  [
    [255,255,255]
  ],
  [
    [255,255,0],
    [0,0,255]
  ],
  [
    [255,0,0],
    [0,255,0],
    [0,0,255]
  ],
  [
    [255,0,0],
    [0,255,0],
    [0,0,255],
    [0,127,127]
  ],
  [
    [255,0,0],
    [0,255,0],
    [0,0,255],
    [0,127,127]
    [127,127,0]
  ]
];
const callbacks = [];
const registerCallback = callback => {
  callbacks.push(callback);
  return callbacks.length-1;
}
const users = [];
const getUserById = id => users.find(user => user.id === id);
const onMessage = jsonString => {
  const data = JSON.parse(jsonString);
  const { user } = data;
  const foundUser = getUserById(user.id);
  if (typeof(foundUser) === 'undefined') {
    users.push(user);
  }
  const userIndex = users.indexOf(foundUser);
  if (callbacks[userIndex]) callbacks[userIndex](data);
}

export default function Home() {
  return (
    <div id="useless">
      {[...Array(streamCount)].map((x, i) =>
        <Waveform
          users={ users }
          color={ colors[streamCount-1][i] }
          registerCallback={ registerCallback }
        />
      )}

      {
        typeof(WebSocket) !== 'undefined' ? (
          <Websocket
            url={ websocketUrl }
            onMessage={ onMessage }
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
  )
}
