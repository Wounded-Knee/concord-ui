import React from 'react';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
	}

	componentDidMount() {
		this.canvasContext = this.canvasRef.current.getContext("2d");
		this.props.draw(this);
		this.x();
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.draw(this);
		this.x();
	}

	render() {
		const width = this.props.width + this.props.secs;
		return <canvas { ...this.props } ref={ this.canvasRef }></canvas>;
	}

	x() {
		const ctx = this.canvasContext;
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.moveTo(0, 0);
		ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
		ctx.stroke();
		ctx.moveTo(0, ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width, 0);
		ctx.stroke();
	}
}

export default Canvas;
