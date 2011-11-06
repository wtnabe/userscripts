// for not only Greasemonkey

/**
 * prepare namespace
 *
 * @since  2006-
 */
(function() {
var Link2title = {
  /**
   * link style info
   *
   * @type Object
   */
  format: {
    Hiki: {
      open:  '[[',
      sep:   '|',
      close: ']]',
      first: 'title'
    },
    PukiWiki: {
      open:  '[[',
      sep:   '>',
      close: ']]',
      first: 'title'
    },
    Markdown: {
      open:  '[',
      sep:   '](',
      close: ')',
      first: 'title'
    },
    FSWiki: {
      open:  '[',
      sep:   '|',
      close: ']',
      first: 'title'
    },
    Hatena: {
      open:  '[',
      sep:   ':title=',
      close: ']',
      first: 'url'
    },
    TracWiki: {
      open:  '[',
      sep:   ' ',
      close: ']',
      first: 'url'
    },
    HTML: {
      open:  '<a href="',
      sep:   '">',
      close: '</a>',
      first: 'url'
    }
  },

  /**
   * create layer
   *
   * includes:
   * <div id="link2title">
   * <span>TITLE</span>
   * <table>
   *  <tr>
   *    <th>style name</th><td>LINKTEXT</td>
   *  </tr>
   *  ..
   * </table>
   * <a href="javascript:void(0)">close</a>
   * </div>
   *
   * If document doesn't have body element, create body with id first.
   *
   * @type void
   */
  create_layer: function() {
    var id  = 'link2title';

    var ele = Link2title.get_layerdiv();
    ele.appendChild( Link2title.get_blocktitle( 'Link texts for this page below:' ) );
    ele.appendChild( Link2title.get_infotable() );
    ele.appendChild( document.createElement( 'br' ) );
    ele.appendChild( Link2title.get_closelink( id ) );

    var body = document.getElementsByTagName( 'body' )[0];
    if ( body ) {
      ele.id = id;
      body.insertBefore( ele, body.firstChild );
    } else {
      var html     = document.getElementsByTagName( 'html' )[0];
      var frameset = document.getElementsByTagName( 'frameset' )[0];
      if ( html && frameset ) {
        var body = document.createElement( 'body' );
        body.id = id;
        body.appendChild( ele );
        html.insertBefore( body, frameset );
      } else {
        alert( 'HTML structure is invalid ?' );
      }
    }
  },

  /**
   * return div element with specified style
   *
   * @since 2006-11-22
   * @type  HTMLElementObject
   */
  get_layerdiv: function() {
    var div   = document.createElement( 'div' );
    var style = {
      fontSize:   'medium',
      position:   'fixed',
      border:     '2px outset black',
      padding:    '.3em .5em',
      background: 'white',
      zIndex:     20,
      maxWidth:   '100%'
    };
    Link2title.apply_style( div, style );

    return div;
  },

  /**
   * return title element of link information layer
   *
   * @since 2006-11-18
   * @param String str
   * @type  HTMLElementObject
   */
  get_blocktitle: function( str ) {
    var title = document.createElement( 'span' );
    var style = {
      fontSize: '92%',
      display:  'block'
    };
    Link2title.apply_style( title, style );
    if ( typeof title.textContent != 'undefined' ) {
      title.textContent = str;
    } else {
      title.innerText = str;
    }
    return title;
  },

  /**
   * Table, ROWs have format and COLUMNs have link text.
   *
   * @since 2006-11-22
   * @type  HTMLElementObject
   */
  get_infotable: function() {
    var table = document.createElement( 'table' );
    var tbody = document.createElement( 'tbody' );
    var style = {
      width: '99%'
    };
    Link2title.apply_style( table, style );
    for ( var name in Link2title.format ) {
      var tr = document.createElement( 'tr' );
      var th = document.createElement( 'th' );
      if ( typeof th.textContent != 'undefined' ) {
        th.textContent = name;
      } else {
        th.innerText = name;
      }
      tr.appendChild( th );
      var td = document.createElement( 'td' );
      td.appendChild( Link2title.get_link2this( name ) );
      tr.appendChild( td );
      tbody.appendChild( tr );
      table.appendChild( tbody );
    }
    return table;
  },

  /**
   * String with link to this page specified stylename
   *
   * includes: link-opener + first + sep + second + link-closer
   *
   * `first' and `second' are each title or location
   *
   * @access private
   * @param  String formatname
   * @type   String
   */
  _get_linktext: function( formatname ) {
    if ( typeof Link2title.format[formatname] == 'object' ) {
      var format = Link2title.format[formatname];

      var title = document.title;
      var url   = document.location;
      if ( title.length === 0 ) {
        title = url;
      }

      var first  = '';
      var second = '';
      if ( format.first == 'url' ) {
        first  = url;
        second = title;
      } else {
        first  = title;
        second = url;
      }

      return ( format.open + first + format.sep + second + format.close);
    } else {
      return '';
    }
  },

  /**
   * input element, includes linktext
   *
   * @param String formatname
   * @type  HTMLElementObject
   */
  get_link2this: function( formatname ) {
    var content = Link2title._get_linktext( formatname );
    var input   = document.createElement( 'input' );
    var attrib  = {
      type:     'text',
      readOnly: 'true',
      value:    content,
      size:     content.length
    };
    var style = {
      width: '98%'
    };
    Link2title.apply_attrib( input, attrib );
    Link2title.apply_style( input, style );
    return input;
  },

  /**
   * remove layer
   *
   * @param string id
   * @type  boolean
   */
  rm_layer: function( id ) {
    var ret = false;

    var ele = document.getElementById( id );
    if ( ele ) {
      var parent = ele.parentNode;
      try {
        parent.removeChild( ele );
        ret = true;
      } catch( e ) {
        ;
      }
    }

    return ret;
  },

  /**
   * HTML link element for remove layer
   *
   * @param String id
   * @type  HTMLElementObject
   */
  get_closelink: function( id ) {
    if ( (typeof id == 'string') && (id.length > 0) ) {
      var a = document.createElement( 'a' );
      a.href        = "javascript:void(0)";
      if ( typeof a.textContent != 'undefined' ) {
        a.textContent = "close";
      } else {
        a.innerText = "close";
      }
      var style = {
        display:   'block',
        textAlign: 'center'
      };
      Link2title.apply_style( a, style );
      try {
        a.attachEvent( 'onclick', function() {
          Link2title.rm_layer( id );
        } );
      } catch ( e ) {
        a.addEventListener( 'click', function() {
          Link2title.rm_layer( id );
        }, false );
      }
      return a;
    } else {
      return false;
    }
  },

  /**
   * apply styles to HTMLElementObject
   *
   * @param HTMLElementObject node
   * @param Object style
   * @type  boolean
   */
  apply_style: function( node, style ) {
    var ret = false;

    if ( (typeof node.nodeType != 'undefined') && (node.nodeType == 1) &&
         (typeof style == 'object') ) {
      var node_style = node.style;
      try {
        for ( var prop in style ) {
          node_style[prop] = style[prop];
        }
        ret = true;
      } catch ( e ) {
        ;
      }
    }

    return ret;
  },

  /**
   * apply attributes to HTMLElementObject
   *
   * @param HTMLElementObject node
   * @param Object attrib
   * @type  boolean
   */
  apply_attrib: function( node, attrib ) {
    var ret = false;

    if ( (typeof node.nodeType != 'undefined') && (node.nodeType == 1) &&
         (typeof attrib == 'object') ) {
      try {
        for ( var prop in attrib ) {
          node[prop] = attrib[prop];
        }
        ret = true;
      } catch ( e ) {
        ;
      }
    }
    return ret;
  }

};

/**
 * launcher
 */
if ( typeof GM_registerMenuCommand == 'function' ) {
  GM_registerMenuCommand( 'Link2title', function() {
                            Link2title.create_layer();
                          } );
} else {
  Link2title.create_layer();
}
})();
