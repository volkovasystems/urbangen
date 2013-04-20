
//Create the header and control panel.
var headerPanel = new Panel( "urbangen", "header", "app-urbangen" );
headerPanel
	.attachToParent( )
	.setHeaderPanel( )
	.setBackgroundColor( "rgb(255,0,0)" )
	.readyPanel( );

var controlPanel = new Panel( "urbangen", "control", "app-urbangen" );
controlPanel
	.attachToParent( )
	.setControlPanel( )
	.setBackgroundColor( "rgb(0,0,255)" )
	.readyPanel( );

//Create two pages. One page for the logo theme and the other page for the information
var logoPage = new Panel( "urbangen", "logo", "app-urbangen" )
logoPage
	.attachToParent( )
	.setAsPagePanel( "logo-page" )
	.setBackgroundColor( "rgb(123,100,100)" );

var infoPage = new Panel( "urbangen", "info", "app-urbangen" );
infoPage
	.attachToParent( )
	.setAsPagePanel( "info-page" )
	.setBackgroundColor( "rgb(123,100,100)" );

var homeLayout = new Layout( "app-urbangen" );
homeLayout
	.addPage( logoPage )
	.addPage( infoPage )
	.setLayoutStyle( c.LAYOUT_STYLE_TRIPAGE )
	.addLayoutStyle( c.LAYOUT_STYLE_TRIPAGE )
	.assignLayoutsToPages( )
	.spanPage( "info-page", 2 )
	.adaptLayout( )
	.readyLayout( );
