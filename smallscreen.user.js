// for not only GreaseMonkey

/**
 * Pseudo Small Screen rendering
 *
 * @since       2006-10-26
 * @constructor
 */
function PseudoSS() {
  /**
   * base css
   *
   * @var    string
   * @since  2006-10-26
   */
  this.base_css = "* { margin: 0; padding: 0; line-height: 1.2em }";
  /**
   * body style
   *
   * @var    Object
   * @since  2006-10-26
   */
  this.body = {
    'background':  'white',
    'font':        'normal 100%/1.2 monospace',
    'color':       'black'
  };
  /**
   * container, for making body overflowed
   *
   * @since  2006-10-26
   * @var    Object
   */
  this.container = {
    'width':       '11.5em',
    'height':      '11.6em',
    'overflow':    'auto',
    'border':      '3px inset black'
  };
  /**
   * list block css
   *
   * @since  2006-10-26
   * @var    Object
   */
  this.list = {
    'padding': '0 0 0 1.5em'
  };
  /**
   * list item css
   *
   * @since  2006-10-26
   * @var    Object
   */
  this.list_item = {
    'margin':  '0 0 0 0em',
    'list-style-position': 'inside'
  };
  /**
   * force `a color' blue
   *
   * @since  2006-10-30
   */
  this.a = {
    'color': 'blue'
  };
}

PseudoSS.prototype = {
  /**
   * @since  2006-10-26
   */
  run: function() {
    this.append_base_css();
    this.insert_container();

    var body = document.getElementsByTagName( 'body' );
    this.apply_style( body[0], this.body );
    var container = document.getElementById( 'container' );
    this.apply_style( container, this.container );

    this.apply_style4elements( 'ul', this.list );
    this.apply_style4elements( 'ol', this.list );
    this.apply_style4elements( 'li', this.list_item );
    this.apply_style4elements( 'a', this.a );
  },

  /**
   * append basic css in <style> element
   *
   * @since  2006-10-26
   */
  append_base_css: function() {
    var head = document.getElementsByTagName( 'head' );
    head = head[0];
    var style_ele = document.createElement( 'style' );
    head.appendChild( style_ele );
    var style = head.getElementsByTagName( 'style' );
    style = style[0];
    style.innerHTML= this.base_css;
  },

  /**
   * insert container <div> element
   *
   * @since  2006-10-26
   */
  insert_container: function() {
    var body = document.getElementsByTagName( 'body' );
    body = body[0];
    var doc = body.innerHTML;
    body.innerHTML = '<div id="container">' + doc + '</div>';
  },

  /**
   * apply JSON-style CSS to element collection
   *
   * @since  2006-10-30
   * @param  String ele
   * @param  Object style
   */
  apply_style4elements: function( ele, style ) {
    var node = document.getElementsByTagName( ele );
    var len = node.length;
    for ( var i = 0; i < len; i++ ) {
      this.apply_style( node[i], style );
    }
  },

  /**
   * apply JSON-style CSS to element
   *
   * @since  2006-10-26
   * @param  DomNode ele
   * @param  Object  style
   */
  apply_style: function( ele, style ) {
    var ele_style = ele.style;
    for ( var prop in style ) {
      ele_style[prop] = style[prop];
    }
  }
};

/**
 * launcher
 *
 * @since 2006-10-26
 */
if ( typeof GM_registerMenuCommand == 'function' ) {
  GM_registerMenuCommand( 'PseudoSS', function() {
                            var pss = new PseudoSS();
                            pss.run();
                          } );
}

var pss = new PseudoSS();
pss.run();
