/**
 * Converts an RGB color value to HSV.
 *
 * @author https://github.com/Gavin-YYC/colorconvert
 *
 * @param   {object} options   - Arguments
 * @param   {number} options.r - The red color value
 * @param   {number} options.g - The green color value
 * @param   {number} options.b - The blue color value
 *
 * @return  {array}            - The HSV representation
 */
function Rgb2hsv({ r, g, b }) {
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
	else { // if( max === b ) {
		h = 60 * ( ( r - g ) / diff ) + 240;
	};

	return [ h, ( s * 100 ), ( v * 100 ) ];
}

/**
 * Converts an HSV color value to RGB.
 *
 * @author https://github.com/Gavin-YYC/colorconvert
 *
 * @param   {number}  h - The hue
 * @param   {number}  s - The saturation
 * @param   {number}  v - The value
 *
 * @typedef  {object} ReturnObject
 *   @property {number}  r  - The red value
 *   @property {number}  g  - The green value
 *   @property {number}  b  - The blue value
 *
 * @return  {ReturnObject}  - The RGB representation
 */
function Hsv2rgb( h, s, v ) {
	h /= 60;
	s /= 100;
	v /= 100;
	const hi = Math.floor( h ) % 6;

	const f = h - Math.floor( h );
	const p = 255 * v * ( 1 - s );
	const q = 255 * v * ( 1 - ( s * f ) );
	const t = 255 * v * ( 1 - ( s * ( 1 - f ) ) );
	v *= 255;

	switch( hi ) {
		case 0:
			return { r: v, g: t, b: p };
		case 1:
			return { r: q, g: v, b: p };
		case 2:
			return { r: p, g: v, b: t };
		case 3:
			return { r: p, g: q, b: v };
		case 4:
			return { r: t, g: p, b: v };
		case 5:
			return { r: v, g: p, b: q };
	}
}

/**
 * Converts RGB to HEX
 *
 * @param  {number} r - The Red value
 * @param  {number} g - The Green value
 * @param  {number} b - The Blue value
 *
 * @return {string}   - A HEX color
 */
function Rgb2hex( r, g, b ) {
	const val = ( ( b | g << 8 | r << 16) | 1 << 24 ).toString( 16 ).slice( 1 );
	return '#' + val.toLowerCase();
}

/**
 * Convert HEX to RGB
 *
 * @param  {string} hex - The HEX color
 *
 * @return {array}      - An object with RGB values
 */
function Hex2rgb( hex ) {
	hex = hex.replace(/^#/, '');

	if( hex.length > 6 ) {
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
 * Convert HSV coordinate to HSVrad (degree to radian)
 *
 * @param  {array}  argument  - The HSV representation of a color
 *
 * @return {array}            - The HSVrad color
 */
function Hsv2hsvRad([ h, s, v ]) {
	return [ ( h * Math.PI ) / 180, s, v ];
}

/**
 * Convert HSVrad color to HSV (radian to degree)
 *
 * @param {number} hRad - H in rad
 * @param {number} s    - S
 * @param {number} v    - V
 *
 * @return {array}    - The HSV color
 */
function HsvRad2hsv( hRad, s, v ) {
	return [ ( hRad * 180 ) / Math.PI, s, v ];
}

/**
 * Convert HEX to HSVrad
 *
 * @param  {string} hex - A HEX color
 *
 * @return {array}      - The HSVrad color
 */
function Hex2hsvRad( hex ) {
	const [ r, g, b, ] = Hex2rgb( hex );
	const hsv = Rgb2hsv({ r, g, b, });
	const hsvRad = Hsv2hsvRad( hsv );

	return hsvRad;
}

/**
 * Convert HSVrad to HEX
 *
 * @param  {number} hRad - The hue in rad
 * @param  {number} s    - The saturation
 * @param  {number} v    - The value
 *
 * @return {string}      - The HEX color
 */
function HsvRad2hex( hRad, s, v ) {
	const [ h ] = HsvRad2hsv( hRad, s, v );
	const { r, g, b } = Hsv2rgb( h, s, v );
	const hex = Rgb2hex( r, g, b );

	return hex;
}

/**
 * Interpolate a linear path from a number to another number
 *
 * @param  {number}  pointA - The number from which to start
 * @param  {number}  pointB - The number to go to
 * @param  {number}  n      - The current step
 * @param  {number}  steps  - The amount of steps
 *
 * @return {number}         - The number at step n
 */
function GetLinear( pointA, pointB, n, steps ) {
	if( steps === 0 ) {
		return pointB;
	}

	return pointA + n * ( ( pointB - pointA ) / steps );
}

/**
 * Interpolate a radial path from a number to another number
 *
 * @param  {number}  fromTheta - The radian from which to start
 * @param  {number}  toTheta   - The radian to go to
 * @param  {number}  n         - The current step
 * @param  {number}  steps     - The amount of steps
 *
 * @return {number}            - The radian at step n
 */
function GetTheta( fromTheta, toTheta, n, steps ) {
	const TAU = 2 * Math.PI;
	let longDistance;

	if( steps === 0 ) {
		return toTheta;
	}

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
	const [ fromHRad, fromS, fromV ] = Hex2hsvRad( fromColor );
	const [ toHRad, toS, toV ] = Hex2hsvRad( toColor );

	const hexColors = [];

	for( let n = 0; n < steps; n++ ) {
		const hRad = GetTheta( fromHRad, toHRad, n, ( steps - 1 ) );
		const s = GetLinear( fromS, toS, n, ( steps - 1 ) );
		const v = GetLinear( fromV, toV, n, ( steps - 1 ) );

		hexColors.push( HsvRad2hex( hRad, s, v ) );
	}

	return hexColors;
}

/**
 * Calculate the gaps between an array of points
 *
 * @param  {array}  points - An array of points, it's not important what's in the array for this function
 * @param  {number} steps  - The amount of steps we have to distribute between the above points
 *
 * @return {array}         - An array of steps per gap
 */
function GetGaps( points, steps ) {
	// steps per gap
	const gapSteps = Math.floor( ( steps - points.length ) / ( points.length - 1 ) );
	// steps left over to be distributed
	const rest = steps - ( points.length + gapSteps * ( points.length - 1 ) );
	// the gaps array has one less items than our points (cause it's gaps between each of the points)
	const gaps = Array( points.length - 1 ).fill( gapSteps );

	// let's fill in the rest from the right
	for( let i = 0; i < rest; i++ ) {
		gaps[ gaps.length - 1 - i ] ++;
	}

	return gaps;
}

/**
 * Generate colors between two given colors
 *
 * @param  {string} fromHex - The color we start from in hex
 * @param  {string} toHex   - The color we end up at in hex
 * @param  {number} steps   - How many colors should be returned
 *
 * @return {array}          - An array for colors
 */
function TransitionBetweenHex( fromHex, toHex, steps ) {
	const fromRgb = Hex2rgb( fromHex );
	const toRgb = Hex2rgb( toHex );
	const hexColors = [];
	steps ++;

	if( steps === -1 ) {
		return [];
	}

	for( let n = 1; n < steps; n++ ) {
		const red = GetLinear( fromRgb[ 0 ], toRgb[ 0 ], n, steps );
		const green = GetLinear( fromRgb[ 1 ], toRgb[ 1 ], n, steps );
		const blue = GetLinear( fromRgb[ 2 ], toRgb[ 2 ], n, steps );

		hexColors.push( Rgb2hex( red, green, blue ) );
	}

	return hexColors;
}

/**
 * Generate n colors between x colors
 *
 * @param  {array}  colors - An array of colors in hex
 * @param  {number} steps  - The amount of colors to generate
 *
 * @return {array}         - An array of colors
 */
function Transition( colors, steps ) {
	const gaps = GetGaps( colors, steps );
	let hexColors = [];

	for( let i = 0; i < colors.length; i++ ) {
		const gap = gaps[ i - 1 ];

		if( colors[ i - 1 ] ) {
			const gapColors = TransitionBetweenHex( colors[ i - 1 ], colors[ i ], gap );
			hexColors = [ ...hexColors, ...gapColors ];
		}

		if( gap !== -1 ) {
			hexColors.push( colors[ i ] );
		}
	}

	return hexColors;
}

// Gradient( '#0000ff', '#00ff00', 85 )
	// .map( color => console.log(`<div style="background: ${ color };width:5rem;height:5rem"></div>`));

// console.log(hsvRad2hex(6.283185307179586,100,100));
// console.log(hsv2rgb( 360, 100, 100 ));
// console.log(hsv2rgb( 359.9999, 100, 100 ));

// console.log(Gradient( '#ff0000', '#0000ff', 5 ));

// console.log(Transition( ['#ff0000', '#00ff00', '#0000ff'], 4 )); // [ 0, 1 ]
console.log(Transition( ['#ff0000', '#0000ff'], 3 )); // [ 1 ]
// console.log(Transition( ['#ff0000', '#0000ff'], 10 )); // [ 1 ]
