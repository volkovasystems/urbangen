function Panel( reference, name, parent ){
	//Create the jQuery instance of the parent
	if( parent instanceof jQuery ){
		this.parent = parent;
		this.parentID = parent.attr( "id" );
	}else if( typeof parent == "string" ){
		this.parent = $( "#" + parent );
		//TODO: Add handler if the selector does not return any parent.
		this.parentID = parent;	
	}else{
		throw new Error( e.formatErrorMessage( "invalid parent container" ) );
	}

	//Local ID created by this instance.
	//This will be used to reference the element.
	this.id = "p" + e.generateUUID( );

	//Set parameters as properties
	this.reference = reference;
	this.name = name;

	//This will contain all the event handler for this object.
	this.handlers = {};

	//Create the jQuery instance of the panel.
	this.panel = $( '<div class="panel-"' + reference 
		+ ' id="' + reference + '-' + name + '" ' + this.id + '></div>' );
	/*
		This will construct a div element with this structure
		<div class="panel-reference" id="reference-name" id></div>
	*/
	
	//Initialize the gap fields.
	this.gap = {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	};

	//Set default panel width and height.
	this.setPanelWidth( )
		.setPanelHeight( );

	var self = this;

	//Maintain that the panel don't have border, margin and padding.
	this.parent.resize( ( this.handlers[ "onCreate" ] = 
		function onCreate( ){
			self.maintainPanel( );
		} ) );

	//Clear the panel.
	this.maintainPanel( );

	//Inititialize default transition values.
	this.fadeState = c.FADE_OUT_TRANSITION;
	this.flowState = c.FLOW_FROM_RIGHT;

	//Do not show first until further configuation.
	this.panel.hide( );
};

//We will always return a new instance of parent's jQuery.
Panel.prototype.getParent = function getParent( ){
	return $( "#" + this.parentID );
};

//We don't want to expose the real panel object.
Panel.prototype.getPanel = function getPanel( ){
	return $( "#" + this.reference + "-" + this.name );
};

Panel.prototype.readyPanel = function readyPanel( ){
	//The panel will only be ready once. It means all configuration is done.
	if( this.isActivated ){
		return this;
	}

	this.resetToOrigin( );
	this.panel.show( );
	this.isActivated = true;

	return this;
};

Panel.prototype.setPageType = function setPageType( type ){
	if( this.pageType ){
		throw new Error( e.formatErrorMessage( "type is already set" ) );
	}
	this.panel.attr( "pagetype", type );
	/*
		This will add pagetype attribute to the div element
		<div class="panel-reference" id="reference-name" id pagetype="page-type"></div>
	*/

	this.pageType = type;

	return this;
};

Panel.prototype.maintainPanel = function maintainPanel( ){
	this.panel.css( {
		border: "none",
		margin: 0,
		padding: "none",
		overflow: "hidden"
	} );

	return this;
};

//Adapt global context for header and control panels.
Panel.prototype.headerPanelHeight = c.PANEL_HEADER_HEIGHT;
Panel.prototype.controlPanelHeight = c.PANEL_CONTROL_HEIGHT;

Panel.prototype.attachToParent = function attachToParent( ){
	if( this.isAttachedToParent ){
		throw new Error( e.formatErrorMessage( "panel is already attached to parent" ) );
	}

	this.isAttachedToParent = true;
	
	this.parent.append( this.panel );

	var self = this;
	//Maintain panel width.
	this.parent.resize( ( this.handlers[ "onAttachToParent" ] = 
		function onAttachToParent( ){
			self.setPanelWidth( );
		} ) );

	//Set immediately the panel width.
	this.setPanelWidth( );

	return this;
};

Panel.prototype.setHeaderPanel = function setHeaderPanel( height ){
	if( this.isActivated ){
		throw new Error( e.formatErrorMessage( "cannot set to other type once activated" ) );
	}

	if( this.parent.hasHeaderPanel ){
		throw new Error( e.formatErrorMessage( "parent already has header panel" ) );
	}

	this.parent.hasHeaderPanel = true;

	this.flowState = c.FLOW_FROM_TOP;

	this.setPanelCurrentHeight( this.headerPanelHeight );

	//So that we know the original panel height.
	e.addConstantProperty( this, "panelHeight", this.headerPanelHeight );

	var self = this;
	this.parent.resize( ( this.handlers[ "onSetHeaderPanel" ] = 
		function onSetHeaderPanel( ){
			self.setPanelHeight( )
				.panel.css( {
					position: "absolute",
					top: 0,
					left: 0
				} );	
		} ) );

	this.setPageType( c.HEADER_PANEL_TYPE );

	this.parent.headerPanel = this.panel;

	this.triggerParent( );

	return this;
};

Panel.prototype.setControlPanel = function setControlPanel( height ){
	if( this.isActivated ){
		throw new Error( e.formatErrorMessage( "cannot set to other type once activated" ) );
	}

	if( this.parent.hasControlPanel ){
		throw new Error( e.formatErrorMessage( "parent already has control panel" ) );
	}

	this.parent.hasControlPanel = true;

	this.flowState = c.FLOW_FROM_BOTTOM;

	this.setPanelCurrentHeight( this.controlPanelHeight );

	//So that we know the original panel height.
	e.addConstantProperty( this, "panelHeight", this.controlPanelHeight );

	var self = this;
	//Maintain control panel height.
	this.parent.resize( ( this.handlers[ "onSetControlPanel" ] = 
		function onSetControlPanel( ){
			self.setPanelHeight( )
				.panel.css( {
					position: "absolute",
					bottom: 0,
					left: 0
				} );	
		} ) );

	this.setPageType( c.CONTROL_PANEL_TYPE );

	this.parent.controlPanel = this.panel;

	this.triggerParent( );

	return this;
};

Panel.prototype.setAsPagePanel = function setAsPagePanel( reference ){
	if( this.isActivated ){
		throw new Error( e.formatErrorMessage( "cannot set to other type once activated" ) );
	}

	/*
		We don't need to maintain anything for the page.
		The page can change size depending on the layout context.
	*/
	if( this.isSetToPagePanel ){
		throw new Error( e.formatErrorMessage( "panel is already set to ordinary page" ) );	
	}

	if( typeof reference != "string" ){
		throw new Error( e.formatErrorMessage( "invalid reference type" ) );
	}

	this.isSetToPagePanel = true;

	this.pageReference = reference;
	this.panel.addClass( reference );

	this.setPageType( c.PAGE_PANEL_TYPE );

	if( this.parent.hasHeaderPanel ){
		this.gap.top = this.parent.headerPanel.outerHeight( );
	}

	if( this.parent.hasControlPanel ){
		this.gap.bottom = this.parent.controlPanel.outerHeight( );
	}

	var self = this;
	//Maintain panel height.
	this.parent.resize( ( this.handlers[ "onSetAsPagePanel" ] = 
		function onSetAsPagePanel( ){
			self.setPanelHeight( );
		} ) );

	//Set immediately the panel height by using the gaps.
	this.processGap( )
		.triggerParent( );
	
	return this;
};

Panel.prototype.setPanelCurrentWidth = function setPanelCurrentWidth( width ){
	this.panelCurrentWidth = width || 0;

	return this;
};

Panel.prototype.setPanelWidth = function setPanelWidth( ){
	this.panel.width( this.panelCurrentWidth || this.parent.outerWidth( ) );

	return this;
};

Panel.prototype.setPanelCurrentHeight = function setPanelCurrentHeight( height ){
	this.panelCurrentHeight = height || 0;

	return this;
};

Panel.prototype.setPanelHeight = function setPanelHeight( ){
	this.panel.height( this.panelCurrentHeight || this.parent.outerHeight( ) );

	return this;
};

Panel.prototype.processGap = function processGap( ){
	this.panel.css( {
		position: "absolute",
		top: this.gap.top,
		bottom: this.gap.bottom,
		left: this.gap.left,
		right: this.gap.right
	} );

	this.setPanelCurrentWidth( this.panel.outerWidth( ) - ( this.gap.left + this.gap.right ) )
		.setPanelCurrentHeight( this.panel.outerHeight( ) - ( this.gap.top + this.gap.bottom ) );

	return this;
};

Panel.prototype.setGap = function setGap( type, value ){
	if( arguments.length == 1 && typeof arguments[ 0 ] == "object" ){
		for( var type in arguments[ 0 ] ){
			if( !!~( [ "top", "left", "botton", "right" ] ).indexOf( type ) ){
				this.gap[ type ] = arguments[ 0 ][ type ];
			}else{
				throw new Error( e.formatErrorMessage( "invalid gap type" ) );		
			}
		}
	}else if( !~( [ "top", "left", "botton", "right" ] ).indexOf( type ) ){
		throw new Error( e.formatErrorMessage( "invalid gap type" ) );
	}else{
		this.gap[ type ] = value;	
	}

	this.processGap( )
		.triggerParent( );

	return this;
};

Panel.prototype.triggerParent = function triggerParent( ){
	this.parent.trigger( "resize" );

	return this;
};

Panel.prototype.setBackgroundColor = function setBackgroundColor( color ){
	if( ( ( /a/ ).test( color ) && color.split( "," ).length != 4 ) 
		|| !( /^rgba?\(\d{1,3},\d{1,3},\d{1,3}(,\d{1,3})?\)$/g ).test( color ) )
	{
		throw new Error( e.formatErrorMessage( "invalid color format" ) );
	}

	this.panel.css( { "background-color": color } );

	return this;
};

Panel.prototype.setContent = function setContent( content ){
	if( !( content instanceof jQuery ) ){
		throw new Error( "invalid content" );
	}
}

Panel.prototype.resetToOrigin = function resetToOrigin( ){
	if( !this.hasFlowed || this.hasResetToOrigin ){
		return this;
	}

	switch( this.flowState ){
		case c.FLOW_FROM_TOP:
			this.panel.css( {
				position: "absolute",
				top: 0 - this.panel.outerHeight( )
			} );
			break;

		case c.FLOW_FROM_LEFT:
			this.panel.css( {
				position: "absolute",
				left: 0 - this.panel.outerWidth( )
			} );
			break;

		case c.FLOW_FROM_BOTTOM:
			this.panel.css( {
				position: "absolute",
				bottom: 0 - this.panel.outerHeight( )
			} );
			break;

		case c.FLOW_FROM_RIGHT:
			this.panel.css( {
				position: "absolute",
				right: 0 - this.panel.outerWidth( )
			} );
			break;
	}

	this.hasResetToOrigin = true;

	return this;
};

Panel.prototype.enableTransition = function enableTransition( ){
	this.hasTransition = true;
	return this;
};

Panel.prototype.disableTransition = function disableTransition( ){
	this.hasTransition = false;
	return this;
};

Panel.prototype.onShow = function onShow( procedure ){

};

Panel.prototype.onHide = function onHide( procedure ){

};

Panel.prototype.fadeTo = function fadeTo( state, limit, flow ){
	if( !this.hasTransition ){
		return this;
	}

	//If flow is present override the current flow state.
	if( flow != this.flowState ){
		this.flowState = flow;
		this.resetToOrigin( );
	}

	//Limit is always in percentage.
	limit = limit || 0;

	var self = this;
	this.hasFlowed = true;

	var onFlowed = function onFlowed( ){
		self.hasFlowed = false;
		switch( this.flowState ){
			case c.FLOW_FROM_TOP:
				if( this.pageType != c.HEADER_PANEL_TYPE ){
					self.flowState = c.FLOWED_FROM_TOP;
				}else{
					self.flowState = c.FLOW_ON_TOP_STANDBY;
				}
				break;

			case c.FLOW_ON_TOP_STANDBY:
				self.flowState = c.FLOW_FROM_TOP;
				break;

			case c.FLOWED_FROM_TOP:
				self.flowState = c.FLOW_FROM_BOTTOM;
				break;

			case c.FLOW_FROM_LEFT:
				self.flowState = c.FLOWED_FROM_LEFT;
				break;

			case c.FLOWED_FROM_LEFT:
				self.flowState = c.FLOW_FROM_RIGHT;
				break;

			case c.FLOW_FROM_BOTTOM:
				if( this.pageType != c.CONTROL_PANEL_TYPE ){
					self.flowState = c.FLOWED_FROM_BOTTOM;
				}else{
					self.flowState = c.FLOW_ON_BOTTOM_STANDBY;
				}
				break;

			case c.FLOW_ON_BOTTOM_STANDBY:
				self.flowState = c.FLOW_FROM_BOTTOM;
				break;

			case c.FLOWED_FROM_BOTTOM:
				self.flowState = c.FLOW_FROM_TOP;
				break;

			case c.FLOW_FROM_RIGHT:
				self.flowState = c.FLOWED_FROM_RIGHT;
				break;

			case c.FLOWED_FROM_RIGHT:
				self.flowState = c.FLOW_FROM_RIGHT;
				break;	
		}
		self.triggerParent( );
	}

	var animation;

	switch( this.flowState ){
		case c.FLOW_FROM_TOP:
			limit = ( this.panel.outerHeight( ) + this.gap.top ) * ( limit / 100 );
			animation = {
				top: this.panel.position( ).top + this.gap.top - limit
			};
			break;

		case c.FLOW_ON_TOP_STANDBY:
			break;

		case c.FLOWED_FROM_TOP:
			break;

		case c.FLOW_FROM_LEFT:
			limit = ( this.panel.outerWidth( ) + this.gap.left ) * ( limit / 100 );
			animation = {
				left: this.panel.position( ).left + this.gap.left - limit
			};
			break;

		case c.FLOWED_FROM_LEFT:
			break;

		case c.FLOW_FROM_BOTTOM:
			limit = ( this.panel.outerHeight( ) + this.gap.bottom ) * ( limit / 100 );
			animation = {
				bottom: this.panel.position( ).bottom + this.gap.bottom - limit
			};
			break;

		case c.FLOW_ON_BOTTOM_STANDBY:
			break;

		case c.FLOWED_FROM_BOTTOM:
			break;

		case c.FLOW_FROM_RIGHT:
			limit = ( this.panel.outerWidth( ) + this.gap.right ) * ( limit / 100 );
			animation = {
				right: this.panel.position( ).right + this.gap.right - limit
			};
			break;

		case c.FLOWED_FROM_RIGHT:
			break;	
	}

	this.panel.animate( animation,
		c.TRANSITION_SPEED,
		onFlowed );

	switch( this.fadeState ){
		case c.FADE_OUT_TRANSITION:

			break;

		case c.FADE_IN_TRANSITION:

			break;
	}
};

Panel.prototype.fadeFromLeft = function fadeFromLeft( state, limit ){

};

Panel.prototype.fadeFromRight = function fadeFromRight( state, limit ){

};

Panel.prototype.fadeFromTop = function fadeFromTop( state, limit ){

};

Panel.prototype.fadeFromBottom = function fadeFromBottom( state, limit ){

};



