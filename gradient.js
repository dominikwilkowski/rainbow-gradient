/**
 * Converts an RGB color value to HSV.
 *
 * @author https://github.com/Gavin-YYC/colorconvert
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 *
 * @return  Array           The HSV representation
 */
function rgb2hsv({ r, g, b }) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max( r, g, b );
	const min = Math.min( r, g, b );
	const diff = max - min;

	let h = 0;
	let v = max;
	let s = max === 0 ? 0 : diff / max;

	// h
	if( max === min ) {
		h = 0;
	}
	else if( max === r && g >= b ) {
		h = 60 * ( ( g - b ) / diff );
	}
	else if( max === r && g < b ) {
		h = 60 * ( ( g - b ) / diff ) + 360;
	}
	else if( max === g ) {
		h = 60 * ( ( b - r ) / diff ) + 120;
	}
	else if( max === b ) {
		h = 60 * ( ( r - g ) / diff ) + 240;
	};

	return [ h, ( s * 100 ), ( v * 100 ) ];
}

/**
 * Converts an HSV color value to RGB.
 *
 * @author https://github.com/Gavin-YYC/colorconvert
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 *
 * @return  Array           The RGB representation
 */

function hsv2rgb( h, s, v ) {
	h /= 1;
	s /= 100;
	v /= 100;

	let r = 0;
	let g = 0;
	let b = 0;

	if( s === 0 ) {
		r = g = b = v;
	}
	else {
		let _h = h / 60;
		let i = Math.floor( _h );
		let f = _h - i;
		let p = v * ( 1 - s );
		let q = v * ( 1 - f * s );
		let t = v * ( 1 - ( 1 - f ) * s );
		switch( i ) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}
	}

	return [ Math.round( r * 255 ), Math.round( g * 255 ), Math.round( b * 255 ) ];
}

/**
 * Converts RGB to HEX
 *
 * @param  {integer} r - The Red value
 * @param  {integer} g - The Green value
 * @param  {integer} b - The Blue value
 *
 * @return {string}    - A HEX color
 */
function rgb2hex( r, g, b ) {
	const val = ( ( b | g << 8 | r << 16) | 1 << 24 ).toString( 16 ).slice( 1 );
	return '#' + val.toLowerCase();
}

/**
 * Convert HEX to RGB
 *
 * @param  {string} hex - The HEX color
 *
 * @return {object}     - An object with RGB values
 */
function hex2rgb( hex ) {
	hex = hex.replace(/^#/, '');

	if( hex.length === 8 ) {
		hex = hex.slice( 0, 6 );
	}

	if( hex.length === 4 ) {
		hex = hex.slice( 0, 3 );
	}

	if( hex.length === 3 ) {
		hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];
	}

	const num = parseInt( hex, 16 );
	const r = num >> 16;
	const g = ( num >> 8 ) & 255;
	const b = num & 255;
	const rgb = [ r, g, b ];

	return rgb;
}

/**
 * Convert HSV coordinate to xyz (Degree to Radians)
 *
 * @param  {array}    -
 * @param  {array}[0] - H
 * @param  {array}[1] - S
 * @param  {array}[2] - V
 *
 * @return {array}    - The xyz coordinates
 */
function hsv2hsvRad([ h, s, v ]) {
	return [ ( h * Math.PI ) / 180, s, v ];
}

/**
 * Convert xyz coordinate to HSV (Radiant to Degree)
 *
 * @param  {array}    -
 * @param  {array}[0] - X
 * @param  {array}[1] - Y
 * @param  {array}[2] - Z
 *
 * @return {array}    - The HSV coordinates
 */
function hsvRad2hsv( hRad, s, v ) {
	return [ ( hRad * 180 ) / Math.PI, s, v ];
}

/**
 * Convert HEX to HSV
 *
 * @param  {string} hex - A HEX color
 *
 * @return {array}      - An array of [ x, y, z ] coordinates
 */
function hex2hsvRad( hex ) {
	const [ r, g, b, ] = hex2rgb( hex );
	const hsv = rgb2hsv({ r, g, b, });
	const hsvRad = hsv2hsvRad( hsv );

	return hsvRad;
}

/**
 * Convert HSV to HEX
 *
 * @param  {integer} x - The x coordinates of the color space HSV
 * @param  {integer} y - The y coordinates of the color space HSV
 * @param  {integer} z - The z coordinates of the color space HSV
 *
 * @return {string}    - A HEX color
 */
function hsvRad2hex( hRad, s, v ) {
	const [ h ] = hsvRad2hsv( hRad, s, v );
	const [ r, g, b ] = hsv2rgb( h, s, v );
	const hex = rgb2hex( r, g, b );

	return hex;
}

/**
 * Generate a linear path from a number to another number
 *
 * @param  {number}  pointA - The number from which to start
 * @param  {number}  pointB - The number to go to
 * @param  {integer} n      - The current step
 * @param  {integer} steps  - The amount of steps
 *
 * @return {number}         - The number at step n
 */
function getLinear( pointA, pointB, n, steps ) {
	return pointA + n * ( ( pointB - pointA ) / steps );
}

/**
 * Generate a radial path from a number to another number
 *
 * @param  {number}  fromTheta - The radiant from which to start
 * @param  {number}  toTheta   - The radiant to go to
 * @param  {integer} n         - The current step
 * @param  {integer} steps     - The amount of steps
 *
 * @return {number}            - The radiant at step n
 */
function getTheta( fromTheta, toTheta, n, steps ) {
	const TAU = 2 * Math.PI;
	let longDistance;

	if( fromTheta > toTheta ) {
		if( fromTheta - toTheta < Math.PI ) {
			longDistance = TAU - ( fromTheta - toTheta );
		}
		else {
			longDistance = toTheta - fromTheta;
		}
	}
	else {
		if( toTheta - fromTheta < Math.PI ) {
			longDistance = ( toTheta - fromTheta ) - TAU;
		}
		else {
			longDistance = -1 * ( fromTheta - toTheta );
		}
	}

	let result = fromTheta + ( n * ( longDistance / steps ) );

	if( result < 0 ) {
		result += TAU;
	}

	if( result > TAU ) {
		result -= TAU;
	}

	return result;
}

/**
 * Generate a rainbow color gradient from one color to another color
 *
 * @param  {string}  fromColor - The color from which to start
 * @param  {string}  toColor   - The color to go to
 * @param  {integer} steps     - The amount of steps of the gradient
 *
 * @return {array}             - An array of colors
 */
function Gradient( fromColor, toColor, steps ) {
	const [ fromHRad, fromS, fromV ] = hex2hsvRad( fromColor );
	const [ toHRad, toS, toV ] = hex2hsvRad( toColor );

	const hexColors = [];

	for( n = 0; n < steps; n++ ) {
		const hRad = getTheta( fromHRad, toHRad, n, ( steps - 1 ) );
		const s = getLinear( fromS, toS, n, ( steps - 1 ) );
		const v = getLinear( fromV, toV, n, ( steps - 1 ) );

		hexColors.push( hsvRad2hex( hRad, s, v ) );
	}

	return hexColors;
}

Gradient( '#ff8800', '#8899dd', 5 )
	.map( color => console.log(`<div style="background: ${ color };width:5rem;height:5rem"></div>`));
