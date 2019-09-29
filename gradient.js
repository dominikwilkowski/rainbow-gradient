/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @author https://gist.github.com/mjackson/5311256
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
	let h;
	const v = max;

	const d = max - min;
	const s = max == 0
		? 0
		: d / max;

	if( max == min ) {
		h = 0;
	}
	else {
		switch( max ) {
			case r:
				h = ( g - b ) / d + ( g < b ? 6 : 0 );
				break;
			case g:
				h = ( b - r ) / d + 2;
				break;
			case b:
				h = ( r - g ) / d + 4;
				break;
		}

		h /= 6;
	}

	return [ h, s, v ];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @author https://gist.github.com/mjackson/5311256
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 *
 * @return  Array           The RGB representation
 */
function hsv2rgb( h, s, v ) {
	let r;
	let g;
	let b;

	const i = Math.floor( h * 6 );
	const f = h * 6 - i;
	const p = v * ( 1 - s );
	const q = v * ( 1 - f * s );
	const t = v * ( 1 - ( 1 - f ) * s );

	switch( i % 6 ) {
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

	return [ r * 255, g * 255, b * 255 ];
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
	return '#' +
		( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b )
		.toString( 16 )
		.slice( 1 );
}

/**
 * Convert HEX to RGB
 *
 * @param  {string} hex - The HEX color
 *
 * @return {object}     - An object with RGB values
 */
function hex2rgb( hex ) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

	return result ? {
		r: parseInt( result[ 1 ], 16 ),
		g: parseInt( result[ 2 ], 16 ),
		b: parseInt( result[ 3 ], 16 )
	} : null;
}

/**
 * Convert HEX to HSV
 *
 * @param  {string} hex - A HEX color
 *
 * @return {array}      - An array of [ x, y, z ] coordinates
 */
function hex2xyz( hex ) {
	const rgb = hex2rgb( hex );
	const [ h, x, z ] = rgb2hsv( rgb );
	const y = h * 360 * ( Math.PI / 180 ); // convert to radiant

	return [ x, y, z ];
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
function xyz2hex( x, y, z ) {
	const h = y / (360 * ( Math.PI / 180 )); // convert to degree
	const [ r, g, b ] = hsv2rgb( h, x, z );

	return rgb2hex( r, g, b );
}

/**
 * Convert a point from a coordinate system to the cylindrical system
 *
 * @param  {integer} x - The x coordinates of the color space HSV
 * @param  {integer} y - The y coordinates of the color space HSV
 * @param  {integer} z - The z coordinates of the color space HSV
 *
 * @return {array}     - An array of a radius, theta and z
 */
function coord2cylindrical( x, y, z ) {
	const TAU = 2 * Math.PI;
	const radius = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
	let theta;

	if( x === 0 ) {
		if( y > 0 ) {
			theta = TAU / 4;
		}
		else if( y < 0 ) {
			theta = 3/4 * TAU;
		}
		else {
			theta = 0;
		}
	}
	else {
		theta = Math.atan( y/x );
	}

	if( theta < 0 ) {
		theta += TAU;
	}

	return [ radius, theta, z ];
}

/**
 * Convert a point from a cylindrical system to the coordinate system
 *
 * @param  {float} radius - The radius of the point
 * @param  {float} theta  - The radiant of the point (theta)
 *
 * @return {[type]}       - The x and y coordinates
 */
function cylindrical2coord( radius, theta ) {
	const x = radius * Math.cos( theta );
	const y = radius * Math.sin( theta );

	return [ x, y ];
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
	const [ fromCoordX, fromCoordY, fromCoordZ ] = hex2xyz( fromColor );
	const [ toCoordX, toCoordY, toCoordZ ] = hex2xyz( toColor );

	// console.log(`${ fromColor } -> ${ fromCoordX }, ${ fromCoordY }, ${ fromCoordZ } -> ${ xyz2hex( fromCoordX, fromCoordY, fromCoordZ ) }`);
	// console.log(`${ toColor } -> ${ toCoordX }, ${ toCoordY }, ${ toCoordZ } -> ${ xyz2hex( toCoordX, toCoordY, toCoordZ ) }`);

	console.log(`fromX: ${ fromCoordX } fromY: ${ fromCoordY } fromZ: ${ fromCoordZ }`);
	console.log(`toX: ${ toCoordX } toY: ${ toCoordY } toZ: ${ toCoordZ }`);

	const [ fromRadius, fromTheta, fromZ ] = coord2cylindrical( fromCoordX, fromCoordY, fromCoordZ );
	const [ toRadius, toTheta, toZ ] = coord2cylindrical( toCoordX, toCoordY, toCoordZ );

	console.log(`fromRadius: ${ fromRadius } fromTheta: ${ fromTheta } fromZ: ${ fromZ }`);
	console.log(`toRadius: ${ toRadius } toTheta: ${ toTheta } toZ: ${ toZ }`);

	// console.log(`(${ toCoordX },${ toCoordY }) -> (${ cylindrical2coord( toRadius, toTheta ) })`);
	console.log();

	for( n = 0; n < steps; n++ ) {
		const radius = getLinear( fromRadius, toRadius, n, ( steps - 1 ) );
		const theta = getTheta( fromTheta, toTheta, n, ( steps - 1 ) );
		const z = getLinear( fromZ, toZ, n, ( steps - 1 ) );

		// const [ x, y ] = cylindrical2coord( radius, theta );

		// console.log(`radius: ${ radius } theta: ${ theta } z: ${ z } hex: ${ xyz2hex( radius, theta, z ) }`);
		console.log(`<div style="background: ${ xyz2hex( radius, theta, z ) };width:5rem;height:5rem"></div>`);
	}
}


const steps = Gradient( '#ff8800', '#8899dd', 5 );
