function Label( label, parent ){
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
	this.id = "l" + e.generateUUID( );

	//Save the label text.
	this.label = label;

	//The reference will be used to refer the label to the parent.
	var reference = this.parent.attr( "class" );

	//Create container but do not put it inside first
	this.container = $( '<label class="label-' + reference 
		+ '" id="label-' + this.id 
		+ '" description="' + this.label.replace( /\"/g, "" ) + '"></label>' );

	//Event handlers
	this.handlers = {};

	//Create a container for text statistics.
	this.textStatistics = {};

	//Initialize the gap. This will be used on the container.
	this.gap = {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	};

	var self = this;
	this.parent.resize( this.handler[ "onCreate" ] = 
		function onCreate( ){
			self.maintainLabel( );
		} );

	this.maintainLabel( );

	this.processAlignment( );

	this.font = new Font( );
	this.font.fontFamily = c.SYSTEM_FONT_FAMILY;

	this.container.hide( );
}

//Default alignment and size.
Label.prototype.alignment = c.ALIGN_MIDDLE_MIDDLE;
Label.prototype.size = c.SYSTEM_FONT_SIZE_SMALL;

Label.prototype.readyLabel = function readyLabel( ){
	if( this.isActivated ){
		return this;
	}

	this.container.show( );
	this.isActivated = true;

	return this;
};

Label.prototype.editLabel = function editLabel( label ){
	this.label = label;
	this.setLabel( );

	return this;
};

Label.prototype.maintainLabel = function maintainLabel( ){
	this.container.css( {
		position: "absolute",
		border: "none",
		margin: 0,
		padding: "none",
		overflow: "hidden",
		"background-color": "transparent",
		"word-wrap": "break-word",
		width: this.textStatistics.width || 0,
		height: this.textStatistics.height || 0
	} );

	return this;
};

Label.prototype.setLabel = function setLabel( ){
	this.container.text( this.label );
	this.container.attr( "description", this.label );

	if( this.hasAdapted ){
		this.triggerParent( );
	}

	return this;
};

Label.prototype.alignLabel = function alignLabel( alignment ){
	if( !~c.ALIGNMENT_LIST.indexOf( alignment ) ){
		throw new Error( e.formatErrorMessage( "invalid alignment" ) );
	}

	this.alignment = alignment;

	this.processAlignment( );

	if( this.hasAdapted ){
		this.adaptLabel( );
	}

	return this;
};

Label.prototype.processAlignment = function processAlignment( ){
	this.alignmentGap = {};
	
	var parentWidth = this.parent.outerWidth( );
	var parentHeight = this.parent.outerHeight( );

	var textStatistics = this.textStatistics 
		|| this.font.measureText( this.label, this.size );

	var textWidth = this.textStatistics.width;
	var textHeight = this.textStatistics.height;

	var labelWidth = this.container.outerWidth( ) || textWidth;
	var labelHeight = this.container.outerHeight( ) || textHeight;

	switch( this.alignment ){
		case c.ALIGN_TOP_LEFT:
			this.alignmentGap.top = Math.round( ( c.SYSTEM_GAP_TOP + this.gap.top )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.left = Math.round( ( c.SYSTEM_GAP_LEFT + this.gap.left )
				- Math.ceil( labelWidth / 2 ) );
			break;

		case c.ALIGN_TOP_MIDDLE:
			this.alignmentGap.top = Math.round( ( c.SYSTEM_GAP_TOP + this.gap.top )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.left = Math.round( ( Math.floor( parentWidth / 2 ) 
				- Math.ceil( labelWidth / 2 ) ) + this.gap.left );
			break;

		case c.ALIGN_TOP_RIGHT:
			this.alignmentGap.top = Math.round( ( c.SYSTEM_GAP_TOP + this.gap.top )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.right = Math.round( ( c.SYSTEM_GAP_RIGHT + this.gap.right )
				- Math.ceil( labelWidth / 2 ) );
			break;

		case c.ALIGN_MIDDLE_LEFT:
			this.alignmentGap.top = Math.round( ( Math.floor( parentHeight / 2 ) 
				- Math.ceil( labelHeight / 2 ) ) + this.gap.top );
			this.alignmentGap.left = Math.round( ( c.SYSTEM_GAP_LEFT + this.gap.left )
				- Math.ceil( labelWidth / 2 ) );
			break;

		case c.ALIGN_MIDDLE_MIDDLE:
			this.alignmentGap.top = Math.round( ( Math.floor( parentHeight / 2 ) 
				- Math.ceil( labelHeight / 2 ) ) + this.gap.top );
			this.alignmentGap.left = Math.round( ( Math.floor( parentWidth / 2 ) 
				- Math.ceil( labelWidth / 2 ) ) + this.gap.left );
			break;

		case c.ALIGN_MIDDLE_RIGHT:
			this.alignmentGap.top = Math.round( ( Math.floor( parentHeight / 2 ) 
				- Math.ceil( labelHeight / 2 ) ) + this.gap.top );
			this.alignmentGap.right = Math.round( ( c.SYSTEM_GAP_RIGHT + this.gap.right )
				- Math.ceil( labelWidth / 2 ) );
			break;

		case c.ALIGN_BOTTOM_LEFT:
			this.alignmentGap.bottom = Math.round( ( c.SYSTEM_GAP_BOTTOM + this.gap.bottom )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.left = Math.round( ( c.SYSTEM_GAP_LEFT + this.gap.left )
				- Math.ceil( labelWidth / 2 ) );
			break;

		case c.ALIGN_BOTTOM_MIDDLE:
			this.alignmentGap.bottom = Math.round( ( c.SYSTEM_GAP_BOTTOM + this.gap.bottom )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.left = Math.round( ( Math.floor( parentWidth / 2 ) 
				- Math.ceil( labelWidth / 2 ) ) + this.gap.left );
			break;

		case c.ALIGN_BOTTOM_RIGHT:
			this.alignmentGap.bottom = Math.round( ( c.SYSTEM_GAP_BOTTOM + this.gap.bottom )
				- Math.ceil( labelHeight / 2 ) );
			this.alignmentGap.right = Math.round( ( c.SYSTEM_GAP_RIGHT + this.gap.right )
				- Math.ceil( labelWidth / 2 ) );
			break;
	}

	this.alignmentProcessed = true;

	return this;
};

Label.prototype.adaptLabel = function adaptLabel( ){
	if( !this.isAttachedToParent ){
		this.parent.append( container );
		this.isAttachedToParent = true;
	}

	if( !this.alignmentProcessed ){
		this.processAlignment( );
	}
	
	//Override alignment gap in cases that the container
	//	is almost near the parent dimension.
	var css = { position: "absolute" };
	var getApproximateDimension = function getApproximateDimension( ){
		var height = css.top || css.bottom;
		var width = css.left || css.right;
		var dimension;
		switch( this.alignment ){
			case c.ALIGN_TOP_MIDDLE:
			case c.ALIGN_BOTTOM_MIDDLE:
				dimension = Math.pow( ( ( height * 2 ) + this.container.outerHeight( ) ), 2 )
					+ Math.pow( ( width + this.container.outerWidth( ) ), 2 );	
				break;

			case c.ALIGN_MIDDLE_MIDDLE:
				dimension = Math.pow( ( ( height * 2 ) + this.container.outerHeight( ) ), 2 )
					+ Math.pow( ( ( width * 2 ) + this.container.outerWidth( ) ), 2 );
				break;

			case c.ALIGN_MIDDLE_LEFT:
			case c.ALIGN_MIDDLE_RIGHT:
				dimension = Math.pow( ( height + this.container.outerHeight( ) ), 2 )
					+ Math.pow( ( ( width * 2 ) + this.container.outerWidth( ) ), 2 );
				break;

			default:
				dimension = Math.pow( ( height + this.container.outerHeight( ) ), 2 )
					+ Math.pow( ( width + this.container.outerWidth( ) ), 2 );
		}
		return Math.round( Math.sqrt( dimension ) );
	};

	var self = this;
	var getParentDimension = function getParentDimension( ){
		return Math.round( Math.sqrt( Math.pow( self.parent.outerHeight( ), 2 ) 
			+ Math.pow( self.parent.outerWidth( ), 2 ) ) );
	}

	for( var gapType in this.alignmentGap ){
		css[ gapType ] = this.alignmentGap[ gapType ];
	}

	while( getApproximateDimension( ) < getParentDimension( ) ){
		this.textStatistics = this.font.measureText( this.label, ++this.size );
		this.processAlignment( );
	}

	this.textStatistics = this.font.measureText( this.label, --this.size );
	
	this.triggerParent( );
	
	if( !this.hasAdapted ){
		this.parent.resize( this.handlers[ "onAdaptLabel" ] =
			function onAdaptLabel( ){
				self.processAlignment( )
					.adaptLabel( );
			} );
	}

	this.hasAdapted = true;

	return this;
};

Label.prototype.setGap = function setGap( type, value ){
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

Label.prototype.processGap = function processGap( ){
	if( this.hasAdapted ){
		this.processAlignment( );	
	}

	return this;
};

Label.prototype.triggerParent = function triggerParent( ){
	this.parent.trigger( "resize" );

	return this;
};

Label.prototype.setLabelColor = function setLabelColor( color ){
	if( ( ( /a/ ).test( color ) && color.split( "," ).length != 4 ) 
		|| !( /^rgba?\(\d{1,3},\d{1,3},\d{1,3}(,\d{1,3})?\)$/g ).test( color ) )
	{
		throw new Error( e.formatErrorMessage( "invalid color format" ) );
	}

	this.container.css( { "color": color } );

	return this;
};

Label.prototype.setHyperLink = function setHyperLink( substring ){

	return this;
}

Label.prototype.underlineLabel = function underlineLabel( substring ){

	return this;
};

Label.prototype.showLabel = function showLabel( ){

	return this;
};

Label.prototype.hideLabel = function hideLabel( ){

	return this;
};

Label.prototype.disableLabel = function disableLabel( ){

	return this;
};

Label.prototype.enableLabel = function enableLabel( ){

	return this;
};

