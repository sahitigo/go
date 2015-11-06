$(document).ready(function(){
  var black = true;
  var gridSize = 9;
  var divCnt = "";
  for (var i = 1; i <= gridSize; i++) {
    for (var j = 1; j <= gridSize; j++) {
      var str1 = "<div class='item' data-position=";
      var str2 = "></div>";
      var str3 = " key=";
      var key = i + "_" + j;
      var divData = str1 + key + str3 + key + str2;
      // console.log(divData);
      divCnt += divData;
    };
  };
  console.log(divCnt);
  // $(divCnt).insertAfter(".container");
  $(".container").html(divCnt);
  // if (document.styleSheets[0].cssRules)
  //   crossrule=document.styleSheets[0].cssRules
  // else if (document.styleSheets[0].rules)
  //   crossrule=document.styleSheets[0].rules
  // crossrule[1].style.gridTemplateRows = "repeat(10, 10vmin)";
  // console.log(crossrule[1].style.gridTemplateRows);
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
