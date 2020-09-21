export default function Waveform({bits}) {
	return (
		<ol className="waveform">
          { bits.map((bit, index) => <li key={index+'_'+bit+'_'+Math.random() * 3000} style={{height: bit+'px', marginTop: (100-bit)/2}}></li>) }
        </ol>
    );
};