import Head from 'next/head'

export default function Home() {
  var bits = [];
  var bits2 = [];
  var bits3 = [];
  var rolling = 50;
  var eccentrism = 0;
  for (var x=0; x<500; x++) {
    eccentrism = parseInt((Math.random() * 30)) * (Math.random() < 0.5 ? -1 : 1);
    rolling = Math.max(0, Math.min(100, rolling + eccentrism));
    bits.push(rolling);
  }

  for (var x=0; x<500; x++) {
    eccentrism = parseInt((Math.random() * 30)) * (Math.random() < 0.5 ? -1 : 1);
    rolling = Math.max(0, Math.min(100, rolling + eccentrism));
    bits2.push(rolling);
  }

  for (var x=0; x<500; x++) {
    eccentrism = parseInt((Math.random() * 30)) * (Math.random() < 0.5 ? -1 : 1);
    rolling = Math.max(0, Math.min(100, rolling + eccentrism));
    bits3.push(rolling);
  }

  const li = (bit, index) => <li key={index+'_'+bit+'_'+Math.random() * 3000} style={{height: bit+'px', marginTop: (100-bit)/2}}></li>; 

  return (
    <div id="useless">
      <ol className="waveform">
        { bits.map(li) }
      </ol>

      <ol className="waveform">
        { bits2.map(li) }
      </ol>

      <ol className="waveform">
        { bits3.map(li) }
      </ol>

      <style jsx>{`
      `}</style>

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
        .waveform li {
          float: left;
          width: 1px;
          height: 100px;
        }

        .waveform:nth-child(1) li {
          background: rgb(255,0,0);
          background: linear-gradient(0deg, rgba(255,0,0,0) 0%, rgba(255,0,0,1) 50%, rgba(255,0,0,0) 100%); 
        }
        .waveform:nth-child(2) li {
          background: rgb(0,255,0);
          background: linear-gradient(0deg, rgba(0,255,0,0) 0%, rgba(0,255,0,1) 50%, rgba(0,255,0,0) 100%); 
        }
        .waveform:nth-child(3) li {
          background: rgb(0,0,255);
          background: linear-gradient(0deg, rgba(0,0,255,0) 0%, rgba(0,0,255,0,1) 50%, rgba(0,0,255,0,0) 100%); 
        }
      `}</style>
    </div>
  )
}
