(function($) {
  var defaults = {
    // Image path (http/base64)
    image: undefined,
    // Position on screen
    x: 'right',
    y: 'bottom',
    // Theme
    theme: 'dark',
    // Template, these classes should ALWAYS be there
    template: '<div class="notiny-base"><img class="notiny-img" /><div class="notiny-text"></div></div>',
    // css width
    width: '300',
    // Text that will be displayed in notification
    text: '',
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
    // Show animation string
    animation_show: 'notiny-animation-show 0.4s forwards',
    // Hide animation string
    animation_hide: 'notiny-animation-hide 0.5s forwards'
  };

  var themedefaults = {
    /*

      Blocks order:

      | container
      | - base
      | -- image
      | -- text
      | - base
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
    notification_class: 'notiny-theme-dark notiny-default-vars'
  });

  addTheme('light', {
    notification_class: 'notiny-theme-dark notiny-default-vars'
  });

  // http://stackoverflow.com/questions/10888211/detect-support-for-transition-with-javascript
  var detectCSSFeature = function(featurename) {
    var feature = false,
      domPrefixes = 'Webkit Moz ms O'.split(' '),
      elm = document.createElement('div'),
      featurenameCapital = null;

    featurename = featurename.toLowerCase();

    if (elm.style[featurename] !== undefined) {
      feature = true;
    }

    if (feature === false) {
      featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
      for (var i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + featurenameCapital] !== undefined) {
          feature = true;
          break;
        }
      }
    }
    return feature;
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

  var closeAction = function(notification, settings) {
    if (settings.animate) {
      if (!settings._state_closing) {
        settings._state_closing = true;
        if (detectCSSFeature('animation') && detectCSSFeature('transform')) {
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

  var showAction = function(notification, settings) {
    if (settings.animate) {
      if (detectCSSFeature('animation') && detectCSSFeature('transform')) {
        notification.css('animation', settings.animation_show);
      } else {
        // Fallback for old browsers
        notification.fadeIn(500);
      }
    }
  };

  var prepareNotification = function(options) {
    var settings = $.extend({}, defaults);
    $.extend(settings, options);
    // Parse and verify position string
    settings = checkPosition(settings);
    settings._curr_theme = themes[settings.theme];

    createNotification(settings);
  };

  var createNotification = function(settings) {
    // Creating notification
    var notification = $(settings.template);

    // Adding classes
    notification.addClass(settings._curr_theme.notification_class);

    var ptext = notification.children('.notiny-text');
    ptext.addClass(settings._curr_theme.text_class);

    // Image
    var img = notification.children('.notiny-img');
    if (settings.image !== undefined) {
      notification.addClass('notiny-with-img');
      img.css('display', 'block');
      img.addClass(settings._curr_theme.image_class);
      img.attr('src', settings.image);
    } else {
      img.hide();
      notification.addClass('notiny-without-img');
    }

    // Width
    notification.css('width', settings.width);

    // Float
    notification.css('float', settings.x);
    notification.css('clear', settings.x);

    ptext.html(settings.text);

    createContainerAndAppend(notification, settings);
  };

  var createContainerAndAppend = function(notification, settings) {
    var elem = $('body');

    // Creating container
    var container;
    var containerId = 'notiny-container-' + settings.x + '-' + settings.y;
    if ($('#' + containerId).length === 0) {
      container = $('<div/>', {
        class: 'notiny-container ' + settings._curr_theme.container_class,
        id: containerId,
      });

      container.css(settings.x, 10);
      container.css(settings.y, 10);

      elem.append(container);
    } else {
      container = $('#' + containerId);
    }

    if (settings.y === 'top') {
      container.prepend(notification);
    } else {
      container.append(notification);
    }

    settings._state_closing = false;

    showAction(notification, settings);

    if (settings.clickhide) {
      notification.click(function() {
        closeAction(notification, settings);
        return false;
      });
      notification.css('cursor', 'pointer');
    }

    if (settings.autohide) {
      setTimeout(function() {
        closeAction(notification, settings);
        // + half second from show animation
      }, settings.delay + 500);
    }
  };

  $.notiny = function(options) {
    prepareNotification(options);
    return this;
  };
}(jQuery));
