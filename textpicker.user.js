// for not only GreaseMonkey

/**
 * Text Picker
 *
 * @since  2006-10-07
 * @constructor
 */
function TextPicker() {
  this.conf = {
    'pick_textnode': true,
    'pick_href':     true,
    'pick_src':      true,
    'pick_alt':      true,
    'pick_title':    true,
    'pick_summary':  true,
    'with_nodename': undefined
  };
}

/**
 * methods of TextPicker
 */
TextPicker.prototype = {
  /**
   * call for exec
   */
  exec: function( obj ) {
    return this.pick( obj );
  },

  /**
   * pick text from Document object
   */
  pick: function( obj ) {
    var dat = [];
    // pick with specified methods
    var types = new Array( 'textnode', 'href', 'src', 'alt', 'title', 'summary' );
    for ( var i in types ) {
      var func = 'pick_'+ types[i];
      if ( this.conf[func] ) {
        var result = this[func]( obj );
        if ( (typeof result != 'undefined') && (result !== '') ) {
          dat.push( result );
        }
      }
    }
    // child nodes
    if ( obj.hasChildNodes() ) {
      var childs = obj.childNodes;
      for ( var i = 0; i < childs.length; i++ ) {
        var result = this.pick( childs[i] );
        if ( (typeof result != 'undefined') && (result !== '') ) {
          dat = dat.concat( result );
        }
      }
    }
    if ( dat.length > 0 ) {
      return dat;
    }
  },

  /**
   * return text node value
   */
  pick_textnode: function( obj ) {
    if ( (obj.nodeName == '#text') &&
         (obj.parentNode.nodeName.toLowerCase() != 'style') &&
         (obj.parentNode.nodeName.toLowerCase() != 'script') ) {
      var str = this.trim( obj.nodeValue );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = obj.parentNode.nodeName.toLowerCase() + ' : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * return <a href>
   */
  pick_href: function( obj ) {
    if ( (obj.nodeName.toLowerCase() == 'a') && obj.hasAttribute( 'href' ) ) {
      var str = this.trim( obj.href );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = 'href : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * return <img src>
   *
   * It's not true src attribute text.
   */
  pick_src: function( obj ) {
    if ( (obj.nodeName.toLowerCase() == 'img') && obj.hasAttribute( 'src' ) ) {
      var str = this.trim( obj.src );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = 'src : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * return <img alt>
   */
  pick_alt: function( obj ) {
    if ( (obj.nodeName.toLowerCase() == 'img') && obj.hasAttribute( 'alt' ) ) {
      var str = this.trim( obj.alt );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = 'alt : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * return <X title>
   */
  pick_title: function( obj ) {
    if ( (typeof obj.tagName != 'undefined') && obj.hasAttribute( 'title' ) ) {
      var str = this.trim( obj.title );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = 'title : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * return <table summary>
   */
  pick_summary: function( obj ) {
    if ( (obj.nodeName.toLowerCase() == 'title') &&
         obj.hasAttribute( 'summary' ) ) {
      var str = this.trim( obj.summary );
      if ( !str.match( /^$/ ) ) {
        if ( this.conf.with_nodename ) {
          str = 'summary : ' + str;
        }
        return str;
      }
    }
  },

  /**
   * remove white spaces
   */
  trim: function( str ) {
    str = str.replace( /^[\s]+/, '' );
    str = str.replace( /[\s]+$/, '' );
    return str;
  }
};

/**
 * @since  2006-11-13
 */
function main() {
  var picker = new TextPicker();
  var html   = document.getElementsByTagName( 'html' );
  var dat    = picker.exec( html[0] );

  // output
  document.open();
  document.write( "<pre>" );
  document.write( dat.join( "\n" ) );
  document.write( "</pre>" );
  document.close();
}

/**
 * launcher
 *
 * @since  2006-10-07
 */
if ( typeof GM_registerMenuCommand == 'function' ) {
  GM_registerMenuCommand( 'TextPicker', function() {
                            main();
                          } );
} else {
  main();
}
