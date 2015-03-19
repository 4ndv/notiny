$(document).ready(function(){
  $(window).resize(function(){
    $(".demo-outer").centerChild(".demo-inner");
  });
  $(window).resize();
});
