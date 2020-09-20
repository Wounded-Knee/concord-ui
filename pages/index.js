import Head from 'next/head';
import Waveform from '../components/Waveform';

export default function Home() {
  const webSocketConfig = {
    url: 'ws://localhost:8080'
  };
  const streamCount = 1;
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
  const makeBits = (count, min, max) => {
    const bits = [];
    var rolling = (max-min)/2;
    var eccentrism = 0;
    for (var x=0; x<count; x++) {
      eccentrism = parseInt((Math.random() * 30)) * (Math.random() < 0.5 ? -1 : 1);
      rolling = Math.max(min, Math.min(max, rolling + eccentrism));
      bits.push(rolling);
    }
    return bits;
  }
  const bits = [];
  for (var x=0; x<streamCount; x++) {
    bits.push(makeBits(500, 0, 100));
  }

  return (
    <div id="useless">
      { bits.map((bits, index) => <Waveform bits={bits} color={colors[streamCount-1][index]} />) }

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

        ${ colors[streamCount-1].map((color, index) => {
          return `
            .waveform {} /* Why TF is this needed? */

            .waveform:nth-child(${index+1}) li {
              background: rgb(${color[0]},${color[1]},${color[2]});
              background: linear-gradient(0deg, rgba(${color[0]},${color[1]},${color[2]},0) 0%, rgba(${color[0]},${color[1]},${color[2]},1) 50%, rgba(${color[0]},${color[1]},${color[2]},0) 100%); 
            }
          `;
        }) }

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
        .waveform li {
          float: left;
          width: 1px;
          height: 100px;
        }
      `}</style>
    </div>
  )
}
