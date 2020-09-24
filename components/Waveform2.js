import React from 'react';
import {
	hrtimeToBigint,
	getHexColor,
	nsToPx,
	pxToNs
} from '../util';
var lastIndex = 0;
var firstCol = 0;
const paintx = false;
const testStripe = false;

export default class Waveform extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		this.color = getHexColor(this.props.color);
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current.getContext("2d");
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = 1;

		this.redraw();
		this.x();
	}

	componentDidUpdate(prevProps, prevState) {
		this.color = getHexColor(this.props.color);
		this.drawFurther();
		this.x();
	}

	redraw() {
		console.log('redraw');
		if (this.props.stream) this.props.stream.map(chunk => this.drawChunk(chunk));
	}

	drawFurther() {
		lastIndex = this.props.stream.length-1;
		if (this.props.stream) this.drawChunks(this.props.stream.slice(lastIndex));
	}

	drawChunks(chunks) {
		//console.log(`Drawing ${chunks.length} chunks from ${lastIndex}`);
		chunks.map(chunk => this.drawChunk(chunk));
	}

	drawChunk(chunk) {
		const { ctx } = this;
		const { height, width } = ctx.canvas;
		const col = nsToPx(hrtimeToBigint(chunk.chunkTime)) - firstCol;
		if (firstCol === 0) firstCol = col;
		const sample = chunk ? (chunk.delightfulness - 53) * 5 : 2;
		const margin = parseInt((height - sample) / 2);
		const [ r, g, b ] = this.props.color;
		const gradient = ctx.createLinearGradient(0, margin, 0, height-margin);
		gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
		gradient.addColorStop(0.5, `rgba(${r},${g},${b},1)`);
		gradient.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
		ctx.strokeStyle = gradient;
		ctx.moveTo(col, margin);
		ctx.lineTo(col, height-margin);
		ctx.stroke();
		if (testStripe) {
			ctx.moveTo(5, 0);
			ctx.lineTo(5, height);
			ctx.stroke();
		}
	}

	getWidth() {
		return this.props.width;
	}

	onClick({clientX}) {
		console.log('Click @', pxToNs(clientX));
		const { ctx } = this;
		const { height, width } = ctx.canvas;
		ctx.strokeStyle = '#f00';
		ctx.moveTo(clientX, 0);
		ctx.lineTo(clientX, height);
		ctx.stroke();

	}

	render() {
		return (
			<>
				<canvas
					{ ...this.props }
					onClick={ this.onClick.bind(this) }
					className="waveform"
					ref={ this.canvasRef }>
				</canvas>

		        <style jsx global>{`
		          .waveformManager {
		            position: relative;
		          }
		          .waveform {
		            position: absolute;
		            top: 0;
		            mix-blend-mode: difference;
		            background: black;
		          }
		        `}</style>
			</>
		);
	}

	x() {
		if (!paintx) return false;
		const { ctx } = this;
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.moveTo(0, 0);
		ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
		ctx.stroke();
		ctx.moveTo(0, ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width, 0);
		ctx.stroke();
		ctx.strokeStyle = this.color;
	}
}
