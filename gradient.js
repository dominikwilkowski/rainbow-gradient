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

function rgb2hex( r, g, b ) {
	return "#" + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString(16).slice(1);
}

function hex2rgb( hex ) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

	return result ? {
		r: parseInt( result[ 1 ], 16 ),
		g: parseInt( result[ 2 ], 16 ),
		b: parseInt( result[ 3 ], 16 )
	} : null;
}

function hex2HSV( hex ) {
	const rgb = hex2rgb( hex );
	const [ h, s, v ] = rgb2hsv( rgb );

	return [ s, h, v ];
}

function HSV2hex( x, y, z ) {
	const [ r, g, b ] = hsv2rgb( y, x, z );

	return rgb2hex( r, g, b );
}

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

function cylindrical2coord( radius, theta ) {
	const x = radius * Math.cos( theta );
	const y = radius * Math.sin( theta );

	return [ x, y ];
}

function getLinear( fromRadius, toRadius, n, steps ) {
	return fromRadius + n * ( ( toRadius - fromRadius ) / steps );
}

function getTheta( fromTheta, toTheta, n, steps ) {
	const TAU = 2 * Math.PI;

	if( fromTheta > toTheta ) {
		if( fromTheta - toTheta < ( TAU / 2 ) ) {
			return fromTheta + n * ( ( TAU - ( fromTheta - toTheta ) ) / steps );
		}
		else {
			return fromTheta + n * ( ( fromTheta - toTheta ) / steps );
		}
	}
	else {
		if( toTheta - fromTheta < ( TAU / 2 ) ) {
			return fromTheta + n * ( ( TAU - ( toTheta - fromTheta ) ) / steps );
		}
		else {
			return fromTheta + n * ( ( toTheta - fromTheta ) / steps );
		}
	}
}

function Gradient( fromColor, toColor, steps ) {
	const [ fromCoordX, fromCoordY, fromCoordZ ] = hex2HSV( fromColor );
	const [ toCoordX, toCoordY, toCoordZ ] = hex2HSV( toColor );

	// console.log(`${ fromColor } -> ${ HSV2hex( fromCoordX, fromCoordY, fromCoordZ ) }`);

	// console.log(`fromX: ${ fromCoordX } fromY: ${ fromCoordY } fromZ: ${ fromCoordZ }`);
	// console.log(`toX: ${ toCoordX } toY: ${ toCoordY } toZ: ${ toCoordZ }`);

	const [ fromRadius, fromTheta, fromZ ] = coord2cylindrical( fromCoordX, fromCoordY, fromCoordZ );
	const [ toRadius, toTheta, toZ ] = coord2cylindrical( toCoordX, toCoordY, toCoordZ );

	console.log(`fromRadius: ${ fromRadius } fromTheta: ${ fromTheta } fromZ: ${ fromZ }`);
	console.log(`toRadius: ${ toRadius } toTheta: ${ toTheta } toZ: ${ toZ }`);

	// console.log(`(${ toCoordX },${ toCoordY }) -> (${ cylindrical2coord( toRadius, toTheta ) })`);
	console.log();

	for( n = 0; n < steps; n++ ) {
		const radius = getLinear( fromRadius, toRadius, n, steps );
		const theta = getTheta( fromTheta, toTheta, n, steps );
		const z = getLinear( fromZ, toZ, n, steps );

		const [ x, y ] = cylindrical2coord( radius, theta );

		console.log(`radius: ${ radius } theta: ${ theta } z: ${ z } hex: ${ HSV2hex( x, y, z ) }`);
	}
}


const steps = Gradient( '#ff8800', '#8899dd', 5 );
