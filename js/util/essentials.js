var _ = _ || {};
var e;

( function( ){
	var essentials = {};

	Object.defineProperty( essentials,
		"addConstantProperty",
		{
			enumerable: true,
			writable: false,
			configurable: false,
			value: 
				function addConstantProperty( object, property, value ){
					if( !arguments.length ){
						throw new Error( JSON.stringify( { error: "invalid parameters" } ) );
					}

					Object.defineProperty( object, property,
						{
							enumerable: true,
							writable: false,
							configurable: false,
							value: value
						} );
				}
		} );

	essentials.addConstantProperty( essentials, "isParameterEmpty",
		function isParameterEmpty( parameter ){
			return parameter === null || parameter === undefined;
		} );

	essentials.addConstantProperty( essentials, "mergeProperties",
		function mergeProperties( source, destination ){
			if( essentials.isParameterEmpty( source ) ){
				throw new Error( essentials.formatErrorMessage( "source is not defined" ) );
			}
			destination = destination || {};
			for( var property in source ){
				if( destination[ property ] === undefined ){
					destination[ property ] = source[ property ];
				}
			}
			return destination;
		} );

	essentials.addConstantProperty( essentials, "formatErrorMessage",
		function formatErrorMessage( message ){
			return JSON.stringify( { error: message } );
		} );

	essentials.addConstantProperty( essentials, "generateUUID",
		function generateUUID( ){
			return md5( uuid.v1( ) + ":" + uuid.v4( )  );
		} );

	essentials.addConstantProperty( essentials, "getWidthGap",
		function getWidthGap( gap ){
			for( var type in gap ){
				if( !~( [ "top", "left", "botton", "right" ] ).indexOf( type ) ){
					throw new Error( e.formatErrorMessage( "invalid gap type" ) );
				}
			}
			if( gap.left == gap.right ){
				return gap.left * 2;
			}
			if( ( gap.left + gap.right ) == ( gap.left || gap.right ) ){
				return ( gap.left || gap.right ) * 2;
			}
			if( gap.left != gap.right ){
				return gap.left + gap.right;
			}
		} );

	essentials.addConstantProperty( essentials, "getHeightGap",
		function getHeightGap( gap ){
			for( var type in gap ){
				if( !~( [ "top", "left", "botton", "right" ] ).indexOf( type ) ){
					throw new Error( essentials.formatErrorMessage( "invalid gap type" ) );
				}
			}
			if( gap.top == gap.bottom ){
				return gap.top * 2;
			}
			if( ( gap.top + gap.bottom ) == ( gap.top || gap.bottom ) ){
				return ( gap.top || gap.bottom ) * 2;
			}
			if( gap.top != gap.bottom ){
				return gap.top + gap.bottom;
			}
		} );

	essentials.addConstantProperty( essentials, "getHeaderPanel",
		function getHeaderPanel( parent ){
			if( !( parent instanceof jQuery ) ){
				throw new Error( essentials.formatErrorMessage( "invalid parent type" ) );
			}
			parent.
		} );

	essentials.addConstantProperty( essentials, "getControlPanel",
		function getControlPanel( parent ){
			if( !( parent instanceof jQuery ) ){
				throw new Error( essentials.formatErrorMessage( "invalid parent type" ) );
			}

		} );

	_.essentials = essentials;
	e = essentials.mergeProperties( essentials, e ) || essentials;
} )( );


