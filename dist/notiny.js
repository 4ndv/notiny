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
    animate: true,
    // Cuts long text strings
    strip: true,
    // Show animation string
    animation_show: 'notiny-animation-show 0.4s forwards',
    // Hide animation string
    animation_hide: 'notiny-animation-hide 0.5s forwards'
  };

  var themedefaults = {
    /*

      Blocks order:

      | container
      | - notification
      | -- image
      | -- text
      | - notification
      | -- image
      | -- text
      | ...

    */
    container_class: '',
    notification_class: '',
    image_class: '',
    text_class: ''
  };

  var themes = {};

  var addTheme = function(name, vars) {
    var opts = $.extend({}, themedefaults);
    $.extend(opts, vars);

    themes[name] = opts;
  };

  $.notinyAddTheme = function(name, vars) {
    addTheme(name, vars);
  };

  // Default themes

  addTheme('dark', {
    notification_class: 'notiny-theme-dark'
  });

  addTheme('light', {
    notification_class: 'notiny-theme-dark'
  });

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

    var curr_theme = themes[settings.theme];

    // Creating notification
    var notification = $('<div/>', {
      class: 'notiny-notification ' + curr_theme.notification_class
    });

    //var texttd = $('<td/>');

    var ptext = $('<div/>', {
      class: 'notiny-notification-text ' + curr_theme.text_class
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
      var img = $('<img/>', {
        src: settings.image,
        class: 'notiny-notification-img ' + curr_theme.image_class
      });

      ptext.css('padding-left', '6px');

      notification.prepend(img);
    }

    // Width
    notification.css('width', settings.width);

    // Float
    notification.css('float', settings.x);
    notification.css('clear', settings.x);

    ptext.html(text);

    notification.append(ptext);

    // Creating container
    var container = undefined;
    var containerId = 'notiny-container-' + settings.x + '-' + settings.y;
    if ($('#' + containerId).length == 0) {
      container = $('<div/>', {
        class: 'notiny-container ' + curr_theme.container_class,
        id: containerId,
      });

      container.css(settings.x, 10);
      container.css(settings.y, 10);

      elem.append(container);
    } else {
      container = $('#' + containerId);
    }

    if (settings.y == 'top') {
      container.prepend(notification);
    } else {
      container.append(notification);
    }

    var closing = false;

    var closeAction = function() {
      if (settings.animate) {
        if (!closing) {
          closing = true;
          if (isAnimationSupported) {
            notification.css('animation', settings.animation_hide);
            setTimeout(function() {
              notification.remove();
            }, 550);
          } else {
            // Fallback for old browsers
            notification.fadeOut(400, function() {
              notification.remove();
            });
          }
        }
      } else {
        notification.remove();
      }
    };

    var showAction = function() {
      if (settings.animate) {
        if (isAnimationSupported) {
          notification.css('animation', settings.animation_show);
        } else {
          // Fallback for old browsers
          notification.fadeIn(500);
        }
      }
    };

    showAction();

    if (settings.clickhide) {
      notification.click(function() {
        closeAction();
        return false;
      });
    }

    if (settings.autohide) {
      setTimeout(function() {
        closeAction();
        // + half second from show animation
      }, settings.delay + 500);
    }
  };

  $.notiny = function(text, options) {
    createNotification(text, options);
    return this;
  };
}(jQuery));
