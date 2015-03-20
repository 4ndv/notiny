(function($) {
  var $body = $('body');
  var $notiny = $('<div class="notiny" />').appendTo($body);

  var defaults = {
    // Image path (http/base64)
    image: undefined,
    // Position on screen
    position: 'right-bottom',
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

    // Classes that will be added to div's

    container_class: '',
    notification_class: '',
    image_class: '',
    text_class: ''
  };

  /**
   * List of possible containers
   */
  var containers = {
    'left-top': $('<div />', {
      class: 'notiny-container',
      css: { top: 10, left: 10 },
    }).appendTo($notiny),
    'left-bottom': $('<div />', {
      class: 'notiny-container',
      css: { bottom: 10, left: 10 },
    }).appendTo($notiny),
    'right-top': $('<div />', {
      class: 'notiny-container',
      css: { top: 10, right: 10 },
    }).appendTo($notiny),
    'right-bottom': $('<div />', {
      class: 'notiny-container',
      css: { bottom: 10, right: 10 },
    }).appendTo($notiny)
  };

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

  var closeAction = function($notification, settings) {
    if (settings.animate) {
      if (!settings._state_closing) {
        settings._state_closing = true;
        if (detectCSSFeature('animation') && detectCSSFeature('transform')) {
          $notification.css('animation', settings.animation_hide);
          setTimeout(function() {
            $notification.remove();
          }, 550);
        } else {
          // Fallback for old browsers
          $notification.fadeOut(400, function() {
            $notification.remove();
          });
        }
      }
    } else {
      $notification.remove();
    }
  };

  var showAction = function($notification, settings) {
    if (settings.animate) {
      if (detectCSSFeature('animation') && detectCSSFeature('transform')) {
        $notification.css('animation', settings.animation_show);
      } else {
        // Fallback for old browsers
        $notification.hide();
        $notification.fadeIn(500);
      }
    }
  };

  var prepareNotification = function(options) {
    createNotification($.extend({}, defaults, options));
  };

  var createNotification = function(settings) {
    // Creating notification
    var $notification = $(settings.template);

    // Theme
    settings.theme = $.notiny.themes[settings.theme];

    // Adding classes
    $notification.addClass(settings.theme.notification_class);

    var $ptext = $notification.find('.notiny-text');
    $ptext.addClass(settings.theme.text_class);
    $ptext.html(settings.text);

    // Image
    var $img = $notification.find('.notiny-img');
    if (settings.image !== undefined) {
      $notification.addClass('notiny-with-img');
      $img.css('display', 'block');
      $img.addClass(settings.theme.image_class);
      $img.attr('src', settings.image);
    } else {
      $img.hide();
      $notification.addClass('notiny-without-img');
    }

    // Width
    $notification.css('width', settings.width);

    appendToContainer($notification, settings);
  };

  var appendToContainer = function($notification, settings) {
    // TODO: Remove in next release
    if(settings.x !== undefined || settings.y !== undefined) {
      $.notiny({ text: '<b>WARNING!:</b> <b>x</b> and <b>y</b> options was removed, please use <b>position</b> instead!', width: 'auto' });
    }

    var $container = containers[settings.position];
    $container.addClass(settings.theme.container_class);

    if (settings.position.slice(-3) === 'top') {
       $container.prepend($notification);
    } else {
       $container.append($notification);
    }

    var floatclear = settings.position.split('-')[0];
    $notification.css('float', floatclear);
    $notification.css('clear', floatclear);

    settings._state_closing = false;

    if (settings.clickhide) {
      $notification.css('cursor', 'pointer');
      $notification.on('click', function() {
        closeAction($notification, settings);
        return false;
      });
    }

    if (settings.autohide) {
      setTimeout(function() {
        closeAction($notification, settings);
        // + half second from show animation
      }, settings.delay + 500);
    }

    showAction($notification, settings);
  };

  $.notiny = function(options) {
    prepareNotification(options);
    return this;
  };

  $.notiny.addTheme = function(name, options) {
    var settings = $.extend({}, themedefaults, options);
    (this.themes = this.themes || {})[name] = settings;
  };

  // TODO: Remove in next major release
  $.notinyAddTheme = function(name, options) {
    $.notiny( { text: '<b>WARNING!:</b> <b>$.notinyAddTheme</b> was removed, please use <b>$.notiny.addTheme</b> instead!', width: 'auto' });
  };

  // Default themes
  $.notiny.addTheme('dark', {
    notification_class: 'notiny-theme-dark notiny-default-vars'
  });
  $.notiny.addTheme('light', {
    notification_class: 'notiny-theme-light notiny-default-vars'
  });
}(jQuery));
