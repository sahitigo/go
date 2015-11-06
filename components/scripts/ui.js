$(document).ready(function(){
  console.log("Hello");
  $(".item").click(function(){
    console.log("Hello click");
    $(this).append("<div class='white-marble'></div>");
  });
});
