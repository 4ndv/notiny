(function($) {
  var g_settings = {};

  var defaults = {
    image: undefined,
    position: 'bottom right',
    theme: 'light',
    width: '300px',
    strip: true
  };

  var parsePosition = function() {
    var newpos = [];
    var x,y = false;
    var args = g_settings.position.split(' ');

    for(var i = 0; i<args.length; i++) {
      if(!x) {
        if(args[i] === 'left' || args[i] === 'right') {
          x = true;
          newpos.push(args[i]);
          g_settings.float = args[i];
        }
      }

      if(!y) {
        if(args[i] === 'top' || args[i] === 'bottom') {
          y = true;
          newpos.push(args[i]);
        }
      }
    }

    if(!x) {
      newpos.push('right');
    }

    if(!y) {
      newpos.push('bottom');
    }

    g_settings.position = newpos.join(' ');
  };

  var createNotification = function(text, options) {
    var elem = $('body');
    g_settings = $.extend(defaults, options);
    // Parse and verify position string
    parsePosition();

    // Local copy of settings
    var settings = g_settings;

    // Creating container
    var containerId = 'notiny-container-' + settings.position_y + '-' + settings.position_x;
    if ($('#' + containerId).length == 0) {
      var container = $('<div/>', {
        class: 'notiny-container',
        id: containerId,
        text: 'test'
      });

      container.css(settings.position_x, 0);
      container.css(settings.position_y, 0);
    }

    elem.append(container);

    // Creating notification
    var notificationClass = 'notify-wrapper-' + settings.theme;
    var notification = $('<div/>', {
      class: notificationClass + ' notify-wrapper'
    });
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
