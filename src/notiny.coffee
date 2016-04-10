(($) ->
  $notiny = $('<div class="notiny" />').appendTo($('body'))
  defaults =
    # Image path (http/base64)
    image: undefined
    # Position on screen
    position: 'right-bottom'
    # Theme
    theme: 'dark'
    # Template, these classes should ALWAYS be there
    template: '<div class="notiny-base"><img class="notiny-img" /><div class="notiny-text"></div></div>'
    # css width
    width: '300'
    # Text that will be displayed in notification
    text: ''
    # Display background or not, if false, background: transparent;
    background: true
    # Hide automatically
    autohide: true
    # Hide by click
    clickhide: true
    # Autohide delay
    delay: 3000
    # Enable animations
    animate: true
    # Show animation string
    animation_show: 'notiny-animation-show 0.4s forwards'
    # Hide animation string
    animation_hide: 'notiny-animation-hide 0.5s forwards'
  themedefaults =

    ###
    # Blocks order:
    # | container
    # | - base
    # | -- image
    # | -- text
    # | - base
    # | -- image
    # | -- text
    # | ...
    ###

    # Classes that will be added to div's

    container_class: ''
    notification_class: ''
    image_class: ''
    text_class: ''

  ###
  # List of possible containers
  ###

  containers =
    'left-top': $('<div />',
      class: 'notiny-container'
      css:
        top: 10
        left: 10).appendTo($notiny)
    'left-bottom': $('<div />',
      class: 'notiny-container'
      css:
        bottom: 10
        left: 10).appendTo($notiny)
    'right-top': $('<div />',
      class: 'notiny-container'
      css:
        top: 10
        right: 10).appendTo($notiny)
    'right-bottom': $('<div />',
      class: 'notiny-container'
      css:
        bottom: 10
        right: 10).appendTo($notiny)
    'fluid-top': $('<div />',
      class: 'notiny-container notiny-container-fluid-top'
      css:
        top: 0
        left: 0
        right: 0).appendTo($notiny)
    'fluid-bottom': $('<div />',
      class: 'notiny-container notiny-container-fluid-bottom'
      css:
        bottom: 0
        left: 0
        right: 0).appendTo($notiny)

  detectCSSFeature = (featurename) ->
    feature = false
    domPrefixes = 'Webkit Moz ms O'.split(' ')
    elm = document.createElement('div')
    featurenameCapital = null
    featurename = featurename.toLowerCase()
    if elm.style[featurename] != undefined
      feature = true
    if feature == false
      featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1)
      i = 0
      while i < domPrefixes.length
        if elm.style[domPrefixes[i] + featurenameCapital] != undefined
          feature = true
          break
        i++
    feature

  closeAction = ($notification, settings) ->
    if settings.animate
      if !settings._state_closing
        settings._state_closing = true
        if detectCSSFeature('animation') and detectCSSFeature('transform')
          $notification.css 'animation', settings.animation_hide
          setTimeout (->
            $notification.remove()
            return
          ), 550
        else
          # Fallback for old browsers
          $notification.fadeOut 400, ->
            $notification.remove()
            return
    else
      $notification.remove()
    return

  showAction = ($notification, settings) ->
    if settings.animate
      if detectCSSFeature('animation') and detectCSSFeature('transform')
        $notification.css 'animation', settings.animation_show
      else
        # Fallback for old browsers
        $notification.hide()
        $notification.fadeIn 500
    return

  prepareNotification = (options) ->
    createNotification $.extend({}, defaults, options)
    return

  createNotification = (settings) ->
    # Creating notification
    $notification = $(settings.template)

    # Theme
    settings.theme = $.notiny.themes[settings.theme]

    # Adding classes
    $notification.addClass settings.theme.notification_class
    $ptext = $notification.find('.notiny-text')
    $ptext.addClass settings.theme.text_class
    $ptext.html settings.text

    # Image
    $img = $notification.find('.notiny-img')
    if settings.image != undefined
      $notification.addClass 'notiny-with-img'
      $img.css 'display', 'block'
      $img.addClass settings.theme.image_class
      $img.attr 'src', settings.image
    else
      $img.hide()
      $notification.addClass 'notiny-without-img'

    # Width
    if settings.position.indexOf('fluid') == -1
      $notification.css 'width', settings.width

    # cache the settings for further use
    $notification.data 'settings', settings
    appendToContainer $notification, settings
    # return the dom for further use
    $notification

  appendToContainer = ($notification, settings) ->
    $container = containers[settings.position]
    $container.addClass settings.theme.container_class
    if settings.position.slice(-3) == 'top'
      $container.prepend $notification
    else
      $container.append $notification
    floatclear = settings.position.split('-')[0]
    $notification.css 'float', floatclear
    $notification.css 'clear', floatclear
    settings._state_closing = false
    if settings.clickhide
      $notification.css 'cursor', 'pointer'
      $notification.on 'click', ->
        closeAction $notification, settings
        false
    if settings.autohide
      setTimeout (->
        closeAction $notification, settings
        # + half second from show animation
        return
      ), settings.delay + 500
    showAction $notification, settings
    return

  $.notiny = (options) ->
    prepareNotification options
    this

  $.notiny.addTheme = (name, options) ->
    settings = $.extend({}, themedefaults, options)
    (@themes = @themes or {})[name] = settings
    return

  # manual close via $.notiny.close

  $.notiny.close = ($notiny) ->
    closeAction $notiny, $notiny.data('settings')
    return

  # Default themes
  $.notiny.addTheme 'dark', notification_class: 'notiny-theme-dark notiny-default-vars'
  $.notiny.addTheme 'light', notification_class: 'notiny-theme-light notiny-default-vars'
  return
) jQuery