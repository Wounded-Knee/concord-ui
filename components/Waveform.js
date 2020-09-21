import React from 'react';
import Canvas from './Canvas';
const qty = 500;

class Waveform extends Canvas {
	constructor(props) {
		super(props);
		props.registerCallbacks({
			receive: this.handleData.bind(this),
			tick: this.tick.bind(this)
		});
	}

	getForwardProps() {
		return {
			className: 'waveform',
			width: 500,
			height: 100
		};
	}

	handleData(data) {
		this.updateCanvas(data);
	}

	tick() {
		this.updateCanvas();
	}

	updateCanvas(data) {
		const ctx = this.canvasContext;
		const sample = data ? (data.delightfulness-53) * 5 : 1;
		const margin = parseInt((100 - sample) / 2);
		const [ r, g, b ] = this.props.color;

		// Handle scroll
		ctx.globalCompositeOperation = "copy";
		ctx.drawImage(ctx.canvas, -1, 0);
		ctx.globalCompositeOperation = "source-over";

		// Draw data line
		const gradient = ctx.createLinearGradient(0, margin, 0, 100-margin);
		gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
		gradient.addColorStop(0.5, `rgba(${r},${g},${b},1)`);
		gradient.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
		ctx.strokeStyle = gradient;
		ctx.lineWidth = 1;
		ctx.moveTo(ctx.canvas.width, margin);
		ctx.lineTo(ctx.canvas.width, 100-margin);
		ctx.stroke();
	}
}

export default Waveform;
