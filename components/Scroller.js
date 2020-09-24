import React from 'react';
const stickyScroll = true;

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
	}

	render() {
		const { width, height } = this.props;
		return (
			<div ref={ this.scrollerRef } className="scroller" style={{ height: height, width: width }}>
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
