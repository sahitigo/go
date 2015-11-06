var game = {

  init: function(gridSize) {
    gridSize = (typeof gridSize === 'undefined') ? 9 : gridSize;  // Default to 9x9 grid if not supplied
    game.currentState = game.initialState(gridSize); // Build initial game array
    game.paintInitialState(gridSize); // Paint the game to the browser
    game.blackScore = 0; // Set scores to 0
    game.whiteScore = 0;
    game.updateScore(0,0);
  },

  initialState: function(gridSize) {
    // Build array of size gridSize x gridSize
    grid = _.range(gridSize).map(function () {
      return _.range(gridSize).map(function () {
        return '.';
      });
    });
    return grid;
  },

  paintInitialState: function(gridSize) {
    // Paint the game to the browser using jQuery
    var divCnt = "";
    for (var i = 1; i <= gridSize; i++) {
      for (var j = 1; j <= gridSize; j++) {
        var str1 = "<div class='item' data-position=";
        var str2 = "></div>";
        var str3 = " id=";
        var str4 = " data-content='.'";
        var key = i + "_" + j;
        var divData = str1 + key + str3 + key + str4 + str2;
        divCnt += divData;
      };
    };
    $(".container").html(divCnt);
  },

  updateScore: function(white, black) {
    game.blackScore += black;
    game.whiteScore += white;
    $("#scoreblack").html(game.blackScore);
    $("#scorewhite").html(game.whiteScore);
  },

  processMove: function(x,y,colour) {

    game.updateCurrentState(x,y,colour); // Update main game array

    if (colour === "b") {
      var colourToFind = "w";
      game.updateScore(0,1); // Update Score
    } else {
      var colourToFind = "b";
      game.updateScore(1,0); // Update Score
    }

    // Find any Go strings (we call them shapes here) adjacent to the placed stone
    var shapes = game.findShapes(x,y,colourToFind); 
    
    // If there are any strings, find necklace needed to contain it
    if (shapes.one.length + shapes.two.length + shapes.three.length + shapes.four.length !== 0) {
      var shapesToDelete = game.findNecklaces(shapes);

      // If the necklace is complete, delete the shape and update the score
      if (shapesToDelete.length > 0) {
        for (i=0; i < shapesToDelete.length; i++) {
          game.deleteShape(shapes[shapesToDelete[i]], colourToFind);
        };      
      };
    };
  },

  // Update main game array
  updateCurrentState: function(x,y,newContent) {
    game.currentState[x][y] = newContent;
  },

  // Find any Go strings (we call them shapes here) adjacent to the placed stone
  findShapes: function(x,y,colour,shape) {
    // Keep track of original position
    var originalX = x,
        originalY = y;

    // Create shapes object containing four possible arrays
    var shapes = {
        one: [],
        two: [],
        three: [],
        four: []
      };

    // Maximum value of x and y to stay in the play area
    var maxPos = game.currentState.length - 1;
    
    // Recursive function which crawls around the shapes
    var shapeCrawler = function(x,y,colour,shape,repeat) {

      repeat = (typeof repeat === 'undefined') ? 0 : repeat;
   
      if (x < maxPos && game.currentState[x+1][y] === colour) { // Look for the same colour
        var pos = (x+1) + "_" + y;
        if (shapes[shape].indexOf(pos) === -1) { // If it is not already in array...
          x++;                                  // ...move position
          shapePush(x,y,colour,shape,repeat); // ...and push into array 
        }
      };

      if (y < maxPos && game.currentState[x][y+1] === colour) { //
        var pos = x + "_" + (y+1);
        if (shapes[shape].indexOf(pos) === -1) { //
          y++;
          shapePush(x,y,colour,shape,repeat);
        }
      };

      if (x > 0 && game.currentState[x-1][y] === colour) { //
        var pos = (x-1) + "_" + y;
        if (shapes[shape].indexOf(pos) === -1) { //
          x--;
          shapePush(x,y,colour,shape,repeat);
        }
      };

      if (y > 0 && game.currentState[x][y-1] === colour) { //
        var pos = x + "_" + (y-1);
        if (shapes[shape].indexOf(pos) === -1) { //
          y--;
          shapePush(x,y,colour,shape,repeat);
        };
      };
    }

    // Push position found by shapeCrawler into array
    var shapePush = function (x,y,colour,shape,repeat) {

      repeat = (typeof repeat === 'undefined') ? 0 : repeat;
      
      var pos = x + "_" + y;
      //if (shapes[shape].indexOf(pos) === -1) {
        shapes[shape].push(pos);
        shapeCrawler(x,y,colour,shape);
        
      // } 
      // else if (repeat < 4) {
      //   repeat ++;
      //   shapeCrawler(x,y,colour,shape,repeat);
      //   console.log(shapes[shape]);
      // };
    }

    // Look around each of the 4 liberties of the placed stone and store any shape data     
    if (originalX < maxPos && game.currentState[originalX+1][originalY] === colour) {
      x = originalX + 1;
      shapePush(x,originalY,colour,"one");
    };

    if (originalY < maxPos && game.currentState[originalX][originalY+1] === colour) {
      y = originalY + 1;
      shapePush(originalX,y,colour,"two");
    };

    if (originalX > 0 && game.currentState[originalX-1][originalY] === colour) {
      x = originalX - 1;
      shapePush(x,originalY,colour,"three");
    };

    if (originalY > 0 && game.currentState[originalX][originalY-1] === colour) {
      y = originalY - 1;
      shapePush(originalX,y,colour,"four");
    };
    
    return shapes;
    
  },

  // Find the necklaces needed to contain and shapes
  findNecklaces: function(shapes) {
        
    var shapesToDelete = [],
        necklaces = {
          one: [],
          two: [],
          three: [],
          four: []
        },
        maxPos = game.currentState.length - 1;

    // Look at coordinate in shape and find what surrounds it
    var processLiberties = function(position, shape) {

      var x = Number(position[0]);
      var y = Number(position[1]);

      // Push 
      if (x < maxPos && game.currentState[x+1][y] === ".") {
        necklaces[shape].push(x+1 + "_" + y)
      };

      if (y < maxPos && game.currentState[x][y+1] === ".") {
        necklaces[shape].push(x + "_" + (y+1))
      };

      if (x > 0 && game.currentState[x-1][y] === ".") {
        necklaces[shape].push(x-1 + "_" + y)
      };

      if (y > 0 && game.currentState[x][y-1] === ".") {
        necklaces[shape].push(x + "_" + (y-1))
      };

    };

    // Look around each shape and construct the necklace
    for (var shape in shapes) {
      // If the shape array is not empty, process it
      if (shapes[shape].length > 0) {
        for (var i = 0; i < shapes[shape].length; i++) { 
          var position = shapes[shape][i].split("_");
          processLiberties(position, shape);
        };
        // If necklaces array is empty, it means it is complete
        if (necklaces[shape].length === 0) {
          // Add the shape to be deleted
          shapesToDelete.push(shape);
        };
      };
    };
    return shapesToDelete;
  },

  deleteShape: function(shape, colour) {
    for (var i = 0; i < shape.length; i++) {
      var pos = shape[i].split("_");
      game.updateCurrentState(pos[0],pos[1],".");
      var id = "#" + (Number(pos[0])+1) + "_" + (Number(pos[1])+1);
      $(id).html("");
      
      // Update Score
      colour === "w" ? game.updateScore(-1,0) : game.updateScore(0,-1);
      

    };
  }

}


$(document).ready(function() {

  game.init();

  var black = true;
  
  // var timeObject = new Date();
  // var time = new Date(timeObject.getTime() + 10000);

  // function timer(time){
  //   $("#timer").countdown(time, function(event){
  //     $(this).text(event.strftime('%S secs'));
  //   })
  //   .on('finish.countdown', function(event) {
  //    timer(new Date(timeObject.getTime() + 10000)); 
  //   });
  // }

  // function timer(){
  //   black = !black;
  //   setTimeout(timer, 10000);
  // }

  $("#btn").click(function(){
    location.reload();
  });

  
  $(".item").click(function(){
    
    var pos = $(this).data("position").split("_");

    if(black){
      $(this).append("<div class='black-marble'></div>");
      $(this).attr('data-content', 'b');
      black = false;     
      game.processMove(pos[0]-1,pos[1]-1,"b");
    }
    else{
      $(this).append("<div class='white-marble'></div>");
      $(this).attr('data-content', 'w');
      black = true;
      game.processMove(pos[0]-1,pos[1]-1,"w");
    }
    // timer(new Date(timeObject.getTime() + 10000));
  });

});

