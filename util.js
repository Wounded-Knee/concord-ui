import config from './config';
const pad = require('pad-left');
const { nsPxFactor } = config;

const hrtimeToBigint = hrtime => {
	if (!hrtime) console.error('hrtime', hrtime);
	return hrtime[0] * 1000000 + hrtime[1] / 1000;
};

const nsToPx = (ns) => ns / nsPxFactor;

const pxToNs = (px) => px * nsPxFactor;

const getHexColor = (color) => '#' + color.map(digit => pad(digit.toString(16), 2, '0')).join('');

export {
	hrtimeToBigint,
	getHexColor,
	nsToPx,
	pxToNs
};
