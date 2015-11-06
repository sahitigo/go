$(document).ready(function(){
  var black = true;
  // console.log("Hello");
  $(".item").click(function(){
    // console.log("Hello click");
    if(black){
      $(this).append("<div class='black-marble'></div>");
      black = false;
    }
    else{
      $(this).append("<div class='white-marble'></div>");
      black = true;
    }
  });
});
