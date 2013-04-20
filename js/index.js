//Clear all borders, margin and paddings
$( "*" ).css( {
	border: "none",
	padding: "none",
	margin: 0,
	overflow: "hidden"
} );

function maintainSize( ){
	$( "html,body,.app" ).css( {
		position: "absolute",
		top: 0,
		left: 0,
		right:0,
		bottom:0,
		height: "100%",
		width: "100%",
		display: "block"
	} );	

	$( "html,body,.app" ).css( {
		height: $( "html" ).outerHeight( ),
		width: $( "html" ).outerWidth( )
	} );
}

$( window ).resize( maintainSize );

maintainSize( );