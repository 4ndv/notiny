(function($) {
  var defaults = {
    // Image path (http/base64)
    image: undefined,
    // Position on screen
    x: 'right',
    y: 'bottom',
    // Theme
    theme: 'dark',
    // css width
    width: '300',
    // Display background or not, if false, background: transparent;
    background: true,
    // Hide automatically
    autohide: true,
    // Hide by click
    clickhide: true,
    // Autohide delay
    delay: 3000,
    // Enable animations
    animate: true
    // Cuts long text strings
    strip: true,
    // Show animation string
    animation_show: 'notiny-animation-show 0.4s forwards',
    // Hide animation string
    animation_hide: 'notiny-animation-hide 0.5s forwards'
  };

  // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
  var isAnimationSupported = function() {
    var animation = false,
      animationstring = 'animation',
      keyframeprefix = '',
      domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
      pfx = '';

    if (elm.style.animationName !== undefined) {
      animation = true;
    }

    if (animation === false) {
      for (var i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
          pfx = domPrefixes[i];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animation = true;
          break;
        }
      }
    }

    return animation;
  };

  var checkPosition = function(g_settings) {
    if (g_settings.x !== 'left' && g_settings.x !== 'right') {
      g_settings.x = 'right';
    }
    if (g_settings.y !== 'top' && g_settings.y !== 'bottom') {
      g_settings.y = 'bottom';
    }

    return g_settings;
  };

  var createNotification = function(text, options) {
    var elem = $('body');

    var settings = $.extend({}, defaults);
    $.extend(settings, options);
    // Parse and verify position string
    settings = checkPosition(settings);
    // Local copy of settings

    // Wrapper
    var wrapper = $('<div/>', {
      class: 'notiny-wrapper'
    });

    // Creating notification
    var notification = $('<table/>', {
      class: 'notiny-theme-' + settings.theme + ' notiny-content'
    });

    var texttd = $('<td/>');

    var ptext = $('<p/>', {
      class: 'notiny-content-text'
    });

    // Strip
    if (settings.strip) {
      ptext.css('white-space', 'nowrap');
      ptext.css('text-overflow', 'ellipsis');
    }

    if (settings.image !== undefined && settings.background && !settings.strip) {
      ptext.css('padding-top', '0px');
    }

    // Image
    if (settings.image !== undefined) {
      var imgtd = $('<td/>', {
        class: 'notiny-content-img'
      });

      var img = $('<img/>', {
        src: settings.image,
        class: 'notiny-content-img'
      });

      ptext.css('padding-left', '6px');

      imgtd.append(img);
      notification.prepend(imgtd);
    }

    // Width
    notification.css('width', settings.width);

    // Float
    notification.css('float', settings.x);
    notification.css('clear', settings.x);

    ptext.html(text);

    texttd.append(ptext);
    notification.append(texttd);

    // Creating container
    var container = undefined;
    var containerId = 'notiny-container-' + settings.x + '-' + settings.y;
    if ($('#' + containerId).length == 0) {
      container = $('<div/>', {
        class: 'notiny-container',
        id: containerId,
      });

      container.css(settings.x, 10);
      container.css(settings.y, 10);

      elem.append(container);
    } else {
      container = $('#' + containerId);
    }

    wrapper.append(notification);
    container.prepend(wrapper);

    var closing = false;

    var closeAction = function() {
      if (!closing) {
        closing = true;
        if (isAnimationSupported) {
          notification.css('animation', settings.animation_hide);
          setTimeout(function() {
            wrapper.remove();
          }, 550);
        } else {
          // Fallback for old browsers
          wrapper.fadeOut(400, function() {
            wrapper.remove();
          });
        }
      }
    };

    var showAction = function() {
      if (isAnimationSupported) {
        notification.css('animation', settings.animation_show);
      } else {
        // Fallback for old browsers
        wrapper.fadeIn(500);
      }
    };

    showAction();

    notification.click(function() {
      closeAction();
      return false;
    })

    setTimeout(function() {
      closeAction();
      // + half second from show animation
    }, settings.delay + 500);
  };

  $.fn.notiny = function(text, options) {
    createNotification(text, options);
    return this;
  };

  $.notiny = function(text, options) {
    createNotification(text, options);
    return this;
  }
}(jQuery));
