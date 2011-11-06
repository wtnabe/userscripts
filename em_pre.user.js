// for not only GreaseMonkey

/**
 * prepare namespace
 */
var EmphasisPre = {
  /**
   * basic style for <pre>
   *
   * @since  2006-11-13
   */
  style: {
    pre: {
      border:     '1px dashed #909090',
      font:       'normal 100%/1.2 monospace',
      padding:    '.25em',
      background: '#f9f9f9'
    }
  },

  /**
   * main()
   *
   * read style hash, parse pre, and create style element
   *
   * @since  2006-11-13
   */
  main: function() {
    var pre = document.getElementsByTagName( 'pre' );
    var len_pre = pre.length;
    for ( var i = 0; i < len_pre; i++ ) {
      EmphasisPre.add_style( pre[i] );
      EmphasisPre.add_closebutton( pre[i] );
      var style = document.createElement( 'style' );
      style.innerHTML = EmphasisPre.get_style( EmphasisPre.style );
      var head = document.getElementsByTagName( 'head' )[0];
      head.appendChild( style );
    }
  },

  /**
   * if `pre' has is, add pre#id:befoer style
   *
   * @since  2006-11-13
   * @param  HTMLElementObject node
   * @type   boolean
   */
  add_style: function( node ) {
    if ( (node.tagName == 'PRE') && (typeof node.id != 'undefined') ) {
      EmphasisPre.style['pre#' + node.id + ':before'] = {
        content:    '"' + node.id + '"',
        display:    'block',
        border:     '1px outset',
        font:       'normal 90%/1.0 monospace',
        background: '#909090',
        color:      '#fefefe'
      };
      return true;
    } else {
      return false;
    }
  },

  /**
   * parse style hash and retuen style text
   *
   * @since  2006-11-13
   * @param  Object style
   * @return String
   */
  get_style: function( style ) {
    var arr = [];
    for ( var i in style ) {
      if ( typeof style[i] == 'object' ) {
        arr.push( i + " {\n" + EmphasisPre.get_style( style[i] ) + "\n}" );
      } else {
        arr.push( i + ': ' + style[i] + ";" );
      }
    }
    return arr.join( "\n" );
  },

  /**
   * create close button in pre
   *
   * @since  2006-11-13
   * @param  HTMLElementObject node
   */
  add_closebutton: function( node ) {
    if ( (typeof node.id == 'string') && (node.id.length > 0) ) {
      var input = document.createElement( 'input' );
      input.type    = "button";
      input.value   = "close";
      input.addEventListener( 'click', function() {
                               EmphasisPre.close( node.id );
                              }, false );
      node.appendChild( input );
    }
  },

  /**
   * turn off a element specified by id
   *
   * @param String id
   */
  close: function( id ) {
    try {
      var ele = document.getElementById( id );
      if ( typeof ele != 'undefined' ) {
        ele.style.display = 'none';
      }
    } catch ( e ) {
      ;
    }
  }
};

/**
 * launcher
 *
 * If you add id for `pre' elements, you can remove them.
 *
 * @since  2006-11-13
 */

GM_registerMenuCommand( 'EmphasisPre', function() {
                          EmphasisPre.main();
                        } );

EmphasisPre.main();
