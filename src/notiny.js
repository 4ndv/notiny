(function($) {
  var defaults = {
    image: undefined,
    x: 'right',
    y: 'bottom',
    theme: 'dark',
    width: '300',
    background: true,
    delay: 3000,
    strip: true
  };

  var checkPosition = function(g_settings) {
    if(g_settings.x !== 'left' && g_settings.x !== 'right') {
      g_settings.x = 'right';
    }
    if(g_settings.y !== 'top' && g_settings.y !== 'bottom') {
      g_settings.y = 'bottom';
    }

    return g_settings;
  };

  var createNotification = function(text, options) {
    var elem = $('body');
    console.log(defaults);
    var settings = $.extend({}, defaults);
    $.extend(settings, options);
    console.log(defaults);
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
    if(settings.strip) {
      ptext.css('white-space', 'nowrap');
      ptext.css('text-overflow', 'ellipsis');
    }

    if(settings.image !== undefined && settings.background && !settings.strip) {
      ptext.css('padding-top', '0px');
    }

    // Image
    if(settings.image !== undefined) {
      var imgtd = $('<td/>');

      var img = $('<img/>', {
        src: settings.image,
        class: 'notiny-content-img'
      });

      imgtd.css('width', img.width());

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
    wrapper.fadeIn(500);

    setTimeout(function(){wrapper.fadeOut(500);}, settings.delay);
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
