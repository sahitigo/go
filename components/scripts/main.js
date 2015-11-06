var game = {

  currentState: [],

  init: function(gridSize) {
    gridSize = (typeof gridSize === 'undefined') ? 9 : gridSize; // Default to 9x9 grid
    game.currentState = game.initialState(gridSize);
    game.paintInitialState(gridSize);
    console.log(game.currentState);
  },

  initialState: function(gridSize) {
    
    grid = _.range(gridSize).map(function () {
      return _.range(gridSize).map(function () {
        return '.';
      });
    });
    return grid;
  },

  paintInitialState: function(gridSize) {
    
    var divCnt = "";
    for (var i = 1; i <= gridSize; i++) {
      for (var j = 1; j <= gridSize; j++) {
        var str1 = "<div class='item' data-position=";
        var str2 = "></div>";
        var str3 = " key=";
        var str4 = " data-content='.'";
        var key = i + "_" + j;
        var divData = str1 + key + str3 + key + str4 + str2;
        // console.log(divData);
        divCnt += divData;
      };
    };
    console.log(divCnt);
    // $(divCnt).insertAfter(".container");
    $(".container").html(divCnt);

  },

  processMove: function(x,y,colour) {

    game.updateCurrentState(x,y,colour);

    if (colour === "b") {
      var colourToFind = "w";
    } else {
      var colourToFind = "b";
    }

    var shapes = game.findShapes(x,y,colourToFind);
    
    if (shapes) {
      var shapesToDelete = game.findNecklaces(shapes);
      if (shapesToDelete !== []) {
        for (var shape in shapesToDelete) {
          game.deleteShape(shapes[shape]);
        };      
      };
    };
  },

  updateCurrentState: function(x,y,newContent) {
    game.currentState[x][y] = newContent;
  },

  findShapes: function(x,y,colour,shape) {
    //var origin = [x][y];

    var shapePush = function (x,y,colour,shape) {
      shapes[shape].push(x + "_" + y);
      findShapes(x,y,colour,shape);
    }

    if (typeof shape === 'undefined') {
        var shape = one;
      }

    if (typeof shapes === 'undefined') {
      var shapes = {
        one: [],
        two: [],
        three: [],
        four: []
      }
    };
    
    if (game.currentState[x+1][y] === colour) {
      x++;
      shapePush(x,y,colour,shape);
    };

    if (game.currentState[x][y+1] === colour) {
      y++;
      shapePush(x,y,colour,shape);
    };

    if (game.currentState[x-1][y] === colour) {
      x--;
      shapePush(x,y,colour,shape);
    };

    if (game.currentState[x][y-1] === colour) {
      y--;
      shapePush(x,y,colour,shape);
    };

    return shapes;
    
  },

  findNecklaces: function(shapes) {

    var processLiberties = function(position, shape) {

      var x = position[0];
      var y = position[1];

      if (game.currentState[x+1][y] === ".") {
        necklaces[shape].push(x+1 + "_" + y)
      };

      if (game.currentState[x][y+1] === ".") {
        necklaces[shape].push(x + "_" + y+1)
      };

      if (game.currentState[x-1][y] === ".") {
        necklaces[shape].push(x-1 + "_" + y)
      };

      if (game.currentState[x][y-1] === ".") {
        necklaces[shape].push(x + "_" + y-1)
      };

    };

    var necklaces = {},
        shapesToDelete = [];

    for (var shape in shapes) {
      for (var i = 0; i < shape.length; i++) {
        var position = shape[i].split("_");
        processLiberties(position, shape);
      };

      if (necklaces[shape] === []) {
        shapesToDelete.push(shape);
      };
    };

    return shapesToDelete;
  },

  deleteShape: function(shape) {
    for (var i = 0; i < shape.length; i++) {
      var pos = shape[i].split("_");
      game.updateCurrentState(pos[0],pos[1],".");
    };
  }

}


$(document).ready(function() {

  game.init();

  var black = true;
  
  $(".item").click(function(){
    // console.log("Hello click");
    if(black){
      $(this).append("<div class='black-marble'></div>");
      $(this).attr('data-content', 'b');
      black = false;
    }
    else{
      $(this).append("<div class='white-marble'></div>");
      $(this).attr('data-content', 'w');
      black = true;
    }
  });

});

