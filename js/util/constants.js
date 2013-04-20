var _ = _ || {};
var c;

( function( ){
	var constants = {};
	
	e.addConstantProperty( constants, "PANEL_CONTROL_HEIGHT", 100 );
	e.addConstantProperty( constants, "PANEL_HEADER_HEIGHT", 50 );

	e.addConstantProperty( constants, "HEADER_PANEL_TYPE", "header-pane" );
	e.addConstantProperty( constants, "CONTROL_PANEL_TYPE", "control-pane" );
	e.addConstantProperty( constants, "PAGE_PANEL_TYPE", "page-pane" );

	e.addConstantProperty( constants, "TRANSITION_SPEED", 50 );

	//Fade constants
	e.addConstantProperty( constants, "FADE_OUT_TRANSITION", "fade-out" );
	e.addConstantProperty( constants, "FADE_IN_TRANSITION", "fade-in" );

	//Flow constants
	e.addConstantProperty( constants, "FLOW_FROM_TOP", "top-flow" );
	e.addConstantProperty( constants, "FLOW_FROM_LEFT", "left-flow" );
	e.addConstantProperty( constants, "FLOW_FROM_BOTTOM", "bottom-flow" );
	e.addConstantProperty( constants, "FLOW_FROM_RIGHT", "right-flow" );
	e.addConstantProperty( constants, "FLOW_ON_TOP_STANDBY", "top-standby-flow" );
	e.addConstantProperty( constants, "FLOW_ON_BOTTOM_STANDBY", "bottom-standby-flow" );
	e.addConstantProperty( constants, "FLOWED_FROM_TOP", "on-top-flow" );
	e.addConstantProperty( constants, "FLOWED_FROM_LEFT", "on-left-flow" );
	e.addConstantProperty( constants, "FLOWED_FROM_BOTTOM", "on-bottom-flow" );
	e.addConstantProperty( constants, "FLOWED_FROM_RIGHT", "on-right-flow" );

	//Alignment constants
	e.addConstantProperty( constants, "ALIGN_TOP_LEFT", "top-left" );
	e.addConstantProperty( constants, "ALIGN_MIDDLE_LEFT", "middle-left" );
	e.addConstantProperty( constants, "ALIGN_BOTTOM_LEFT", "bottom-left" );
	e.addConstantProperty( constants, "ALIGN_TOP_MIDDLE", "top-middle" );
	e.addConstantProperty( constants, "ALIGN_MIDDLE_MIDDLE", "middle-middle" );
	e.addConstantProperty( constants, "ALIGN_BOTTOM_MIDDLE", "bottom-middle" );
	e.addConstantProperty( constants, "ALIGN_TOP_RIGHT", "top-right" );
	e.addConstantProperty( constants, "ALIGN_MIDDLE_RIGHT", "middle-right" );
	e.addConstantProperty( constants, "ALIGN_BOTTOM_RIGHT", "bottom-right" );
	e.addConstantProperty( constants, "ALIGNMENT_LIST", [
			constants.ALIGN_TOP_LEFT,
			constants.ALIGN_MIDDLE_LEFT,
			constants.ALIGN_BOTTOM_LEFT,
			constants.ALIGN_TOP_MIDDLE,
			constants.ALIGN_MIDDLE_MIDDLE,
			constants.ALIGN_BOTTOM_MIDDLE,
			constants.ALIGN_TOP_RIGHT,
			constants.ALIGN_MIDDLE_RIGHT,
			constants.ALIGN_BOTTOM_RIGHT
		] );

	e.addConstantProperty( constants, "SYSTEM_FONT_FAMILY", "Segoe UI,Calibri,Ubuntu Light,Tahoma" );
	e.addConstantProperty( constants, "SYSTEM_FONT_SIZE_SMALL", 10 );
	e.addConstantProperty( constants, "SYSTEM_FONT_SIZE_NORMAL", 16 );
	e.addConstantProperty( constants, "SYSTEM_FONT_SIZE_BIG", 32 );

	e.addConstantProperty( constants, "SYSTEM_GAP_TOP", 10 );
	e.addConstantProperty( constants, "SYSTEM_GAP_LEFT", 5 );
	e.addConstantProperty( constants, "SYSTEM_GAP_BOTTOM", 10 );
	e.addConstantProperty( constants, "SYSTEM_GAP_RIGHT", 5 );

	//Layout orientation constants.
	e.addConstantProperty( constants, "LAYOUT_ORIENTATION_PORTRAIT", "portrait-orientation" );
	e.addConstantProperty( constants, "LAYOUT_ORIENTATION_LANDSCAPE", "landscape-orientation" );
	e.addConstantProperty( constants, "LAYOUT_ORIENTATION_MIXED", "mixed-orientation" );
	e.addConstantProperty( constants, "LAYOUT_ORIENTATION_LIST", [
			constants.LAYOUT_ORIENTATION_PORTRAIT,
			constants.LAYOUT_ORIENTATION_LANDSCAPE,
			constants.LAYOUT_ORIENTATION_MIXED
		] );

	//Layout constants.
	e.addConstantProperty( constants, "LAYOUT_STYLE_NORMAL", "normal-layout" );
	e.addConstantProperty( constants, "LAYOUT_STYLE_GRID", "grid-layout" );
	e.addConstantProperty( constants, "LAYOUT_STYLE_HALFPAGE", "halfpage-layout" );
	e.addConstantProperty( constants, "LAYOUT_STYLE_TRIPAGE", "tripage-layout" );
	e.addConstantProperty( constants, "LAYOUT_STYLE_QUADPAGE", "quadpage-layout" );
	e.addConstantProperty( constants, "LAYOUT_STYLE_LIST", [
			constants.LAYOUT_STYLE_NORMAL,
			constants.LAYOUT_STYLE_GRID,
			constants.LAYOUT_STYLE_HALFPAGE,
			constants.LAYOUT_STYLE_TRIPAGE,
			constants.LAYOUT_STYLE_QUADPAGE
		] );

	e.addConstantProperty( constants, "SPAN_ORIENTATION_GRID", "grid-span" );
	e.addConstantProperty( constants, "SPAN_ORIENTATION_FLOW", "flow-span" );

	//Aliases
	_.constants = constants;
	c = e.mergeProperties( constants, c ) || constants;
} )( );