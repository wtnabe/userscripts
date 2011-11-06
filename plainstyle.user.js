// for not only Greasemonkey

/**
 * prepare namespace
 *
 * @since  2006-11-19
 */
var PlainStyle = {
  /**
   * disable stylesheet objects and start removing all elements' style
   */
  run: function() {
    var sheets = document.styleSheets.length;
    for ( var i = 0; i < sheets; i++ ) {
      document.styleSheets[i].disabled = true;
    }
    var body = document.getElementsByTagName( 'body' )[0];
    PlainStyle.rm_r( body );
  },

  /**
   * remove style attribute ( recursive )
   */
  rm_r: function( node ) {
    if ( (typeof node.nodeType != 'undefined') && (node.nodeType == 1) ) {
      node.removeAttribute( 'style' );
      node.removeAttribute( 'color' );
      node.removeAttribute( 'bgcolor' );
      node.removeAttribute( 'size' );
      node.removeAttribute( 'align' );
      node.removeAttribute( 'valign' );
      node.removeAttribute( 'width' );
      node.removeAttribute( 'height' );
    }
    if ( node.hasChildNodes ) {
      var childs   = node.childNodes;
      var childlen = childs.length;
      for ( var i = 0; i < childlen; i++ ) {
        PlainStyle.rm_r( childs[i] );
      }
    }
  }
};

/**
 * launcher
 *
 * @since  2006-11-19
 */
if ( typeof GM_registerMenuCommand == 'function' ) {
  GM_registerMenuCommand( 'PlainStyle', function() {
                            PlainStyle.run();
                          } );
} else {
  PlainStyle.run();
}
