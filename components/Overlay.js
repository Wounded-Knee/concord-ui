import Canvas from './Canvas';

class Overlay extends Canvas {
	constructor(props) {
		super(props);
	}

	getForwardProps() {
		const { height, width } = this.props;

		return {
			className: 'overlay',
			width: width,
			height: height
		};
	}
}

export default Overlay;
