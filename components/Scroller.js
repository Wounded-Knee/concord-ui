import React from 'react';
import { nsToPx } from '../util';
const stickyScroll = true;
const syncScroll = true;
var syncScrollOn = syncScroll;

export default class Scroller extends React.Component {
	constructor(props) {
		super(props);
		this.scrollerRef = React.createRef();
	}

	componentDidMount() {
		const { scrollLeftMax } = this.scrollerRef.current;
		this.scrollerRef.current.scrollLeft = scrollLeftMax;
	}

	componentDidUpdate(prevProps, prevState) {
		const { scrollLeftMax, scrollLeft } = this.scrollerRef.current;
		if (stickyScroll && scrollLeftMax - scrollLeft < 250) {
			this.scrollerRef.current.scrollLeft = scrollLeftMax;
		}
		this.syncScroll();
	}

	syncScroll() {
		if (!syncScrollOn) return false;
		const { sync } = this.props;
		const scrollPos = nsToPx(sync) / window.devicePixelRatio;
		this.scrollerRef.current.scrollLeft = scrollPos;
	}

	onMouseOver() {
		syncScrollOn = false;
	}

	onMouseOut() {
		syncScrollOn = syncScroll;
	}

	render() {
		const { width, height } = this.props;
		return (
			<div
				ref={ this.scrollerRef }
				className="scroller"
				style={{
					height: height,
					width: width
				}}
				onMouseOut={ this.onMouseOut.bind(this) }
				onMouseOver={ this.onMouseOver.bind(this) }
			>
				{ this.props.children }

				<style jsx global>{`
					.scroller {
						overflow: auto;
						overflow-y: hidden;
						border: 1px inset #ccc;
					}
				`}</style>
			</div>
		);
	}
}
