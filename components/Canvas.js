import React from 'react';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
	}

	// For overriide
	getForwardProps() {
		return {};
	}

	componentDidMount() {
		this.canvasContext = this.canvasRef.current.getContext("2d");
	}

	render() {
		return <canvas { ...this.getForwardProps() } ref={ this.canvasRef }></canvas>;
	}
}

export default Canvas;
