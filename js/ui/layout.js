function Layout( parent ){
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

	//This is where all pages will be stored.
	this.pages = {};

	//Layout settings.
	this.layoutSettings = [];

	//Initialize the gap fields.
	this.gap = {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	};

	//Local ID created by this instance.
	//This will be used to reference the element.
	this.id = "lt" + e.generateUUID( );

	this.handlers = {};
}

Layout.prototype.layoutStyle = c.LAYOUT_STYLE_NORMAL;
Layout.prototype.layoutOrientation = c.LAYOUT_ORIENTATION_LANDSCAPE;

Layout.prototype.readyLayout = function readyLayout( ){
	if( this.isActivated ){
		return this;
	}

	for( var id in this.pages ){
		this.pages[ id ].readyPanel( );
	}
	this.isActivated = true;

	return this;
}

Layout.prototype.addPage = function addPage( page ){
	if( !( page instanceof Panel ) ){
		throw new Error( e.formatErrorMessage( "invalid page" ) );
	}

	this.pages[ page.id ] = page;

	return this;
};

Layout.prototype.setLayoutStyle = function setLayoutStyle( style ){
	if( !~c.LAYOUT_STYLE_LIST.indexOf( style ) ){
		throw new Error( e.formatErrorMessage( "invalid layout style" ) );
	}

	if( this.layoutStyle instanceof Array ){
		this.layoutStyle.push( style );
	}else{
		this.layoutStyle = style;	
	}

	return this;
};

Layout.prototype.addLayoutStyle = function addLayoutStyle( style ){

	if( !( this.layoutStyle instanceof Array ) ){
		this.layoutStyle = ( !this.layoutStyle )? [] : [ this.layoutStyle ];
		this.primaryLayoutOrientation = this.layoutOrientation;
		this.setLayoutOrientation( c.LAYOUT_ORIENTATION_MIXED );
	}
	
	this.setLayoutStyle( style );

	return this;
};

Layout.prototype.assignLayoutsToPages = function assignLayoutsToPages( ){
	//Take note that order of layout and page is observed here.
	if( this.layoutOrientation != c.LAYOUT_ORIENTATION_MIXED ){
		throw new Error( e.formatErrorMessage( "invalid procedure" ) );
	}

	if( Object.keys( this.pages ).length != this.layoutStyle.length ){
		throw new Error( e.formatErrorMessage( "page and layout mismatched" ) );
	}

	var pages = Object.keys( this.pages );

	for( var index in pages ){
		this.pages[ pages[ index ] ].assignedLayout = this.layoutStyle[ index ]; 
	}

	return this;
};

Layout.prototype.setLayoutOrientation = function setLayoutOrientation( orientation ){
	if( !~c.LAYOUT_ORIENTATION_LIST.indexOf( orientation ) ){
		throw new Error( e.formatErrorMessage( "invalid layout orientation" ) );
	}

	//Mixed orientation is an exception in this set layout method
	// if layout style is not multi-valued.
	if( orientation == c.LAYOUT_ORIENTATION_MIXED 
		&& !( this.layoutStyle instanceof Array ) )
	{
		return this;
	}

	if( this.layoutOrientation == c.LAYOUT_ORIENTATION_MIXED ){
		this.primaryLayoutOrientation = orientation;
	}else{
		this.layoutOrientation = orientation;
	}

	return this;
};

Layout.prototype.getPage = function getPage( page ){
	if( typeof page != "string" ){
		throw new Error( e.formatErrorMessage( "invalid page id or page reference" ) );
	}

	return this.pages[ page ] || ( function getPageByReference( ){
		for( var id in this.pages ){
			if( this.pages[ id ].getPanel( ).attr( "id" ) == page ){
				return this.pages[ id ];
			}else if( this.pages[ id ].pageReference == page ){
				return this.pages[ id ];
			}
		}
	} ).apply( this );
}

Layout.prototype.spanPage = function spanPage( page, span ){
	if( this.layoutOrientation != c.LAYOUT_ORIENTATION_MIXED ){
		return this;
	}

	/*
		There are two types of span, perfect square spans and divisible by 2
		If the span is a perfect square then it is identified as grid span.

		If the span is divisible by 2 then it is non grid span or flow span
	*/

	//Test the spanning.
	switch( this.layoutStyle ){
		case c.LAYOUT_STYLE_HALFPAGE:
		case c.LAYOUT_STYLE_NORMAL:
			throw new Error( e.formatErrorMessage( "spanning is inapplicable on normal pages" ) );

		case c.LAYOUT_STYLE_GRID:
			//Approximate based on the number of pages and their spans

			break;

		case c.LAYOUT_STYLE_TRIPAGE:
			if( span != 2 ){
				throw new Error( e.formatErrorMessage( "span value exceeds required range" ) );
			}
			break;

		case c.LAYOUT_STYLE_QUADPAGE:
			if( span != 2 && span != 3 ){
				throw new Error( e.formatErrorMessage( "span value exceeds required range" ) );
			}
			break;
	}

	page = this.getPage( page );
	page.pageSpan = span;
	page.spanOrientation = ( function determineSpanOrientation( ){
		if( span % Math.sqrt( span ) == 0 ){
			return c.SPAN_ORIENTATION_GRID;
		}
		return c.SPAN_ORIENTATION_FLOW;
	} )( );


	return this;
}

Layout.prototype.adaptLayout = function adaptLayout( ){

	var parentWidth = this.parent.outerWidth( );
	var parentHeight = this.parent.outerHeight( );

	if( this.layoutOrientation != c.LAYOUT_ORIENTATION_MIXED ){
		switch( this.layoutStyle ){
			case c.LAYOUT_STYLE_NORMAL:
				//Do nothing?
				break;

			case c.LAYOUT_STYLE_GRID:

				break;

			case c.LAYOUT_STYLE_HALFPAGE:
				
				break;

			case c.LAYOUT_STYLE_TRIPAGE:
				
				break;

			case c.LAYOUT_STYLE_QUADPAGE:
				
				break;
		}
	}

	switch( this.layoutOrientation ){
		case c.LAYOUT_ORIENTATION_PORTRAIT:
			break;

		case c.LAYOUT_ORIENTATION_LANDSCAPE:
			break;

		case c.LAYOUT_ORIENTATION_MIXED:
			var pages = Object.keys( this.pages );
			var page;
			for( var index in pages ){
				page = this.pages[ pages[ index ] ];
				switch( page.assignedLayout ){
					case c.LAYOUT_STYLE_NORMAL:
						//Do nothing?
						break;

					case c.LAYOUT_STYLE_GRID:

						break;

					case c.LAYOUT_STYLE_HALFPAGE:
						
						break;

					case c.LAYOUT_STYLE_TRIPAGE:
						switch( this.primaryLayoutOrientation ){
							
							case c.LAYOUT_ORIENTATION_PORTRAIT:
								var height = Math.floor( parentHeight / 3 )
									* ( page.pageSpan || 1 );

								page.primaryGap = page.primaryGap || {
									top: page.gap.top,
									left: page.gap.left,
									bottom: page.gap.bottom,
									right: page.gap.right
								};
								
								var heightGap = e.getHeightGap( page.primaryGap )
									+ e.getHeightGap( this.gap );

								var widthGap = e.getWidthGap( page.primaryGap )
									+ e.getWidthGap( this.gap );

								page.setPanelCurrentWidth( parentWidth - this.gap.right )
									.setPanelCurrentHeight( height - this.gap.bottom )
									.setPanelWidth( )
									.setPanelHeight( )
									.setGap( {
										top: ( index * height ) + page.primaryGap.top 
											+ this.gap.top,
										left: page.primaryGap.top + this.gap.left
									} );
								break;

							case c.LAYOUT_ORIENTATION_LANDSCAPE:
								var width = Math.floor( parentWidth / 3 ) 
									* ( page.pageSpan || 1 );
								
								page.primaryGap = page.primaryGap || {
									top: page.gap.top,
									left: page.gap.left,
									bottom: page.gap.bottom,
									right: page.gap.right
								};

								var heightGap = e.getHeightGap( page.primaryGap )
									+ e.getHeightGap( this.gap );

								var widthGap = e.getWidthGap( page.primaryGap )
									+ e.getWidthGap( this.gap );

								page.setPanelCurrentHeight( parentHeight - heightGap )
									.setPanelCurrentWidth( width - widthGap )
									.setPanelWidth( )
									.setPanelHeight( )
									.setGap( {
										left: ( index * width ) + page.primaryGap.left 
											+ this.gap.left,
										top: page.primaryGap.top + this.gap.top
									} );
								break;
						}
						break;

					case c.LAYOUT_STYLE_QUADPAGE:
						
					
				}			
			}	
	}

	var self = this;
	if( !this.hasAdapted ){
		this.parent.resize( this.handlers[ "onAdaptLayout" ] =
			function onAdaptLayout( ){
				self.adaptLayout( );
			} );
	}

	this.hasAdapted = true;

	return this;
};

Layout.prototype.setGap = function setGap( type, value ){
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
}

Layout.prototype.processGap = function processGap( ){
	//I don't know what to do here :|

	return this;
};

Layout.prototype.triggerParent = function triggerParent( ){
	this.parent.trigger( "resize" );

	return this;
};


