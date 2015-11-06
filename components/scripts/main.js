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
        var str3 = " id=";
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
    //debugger;
    
    if (shapes.one.length + shapes.two.length + shapes.three.length + shapes.four.length !== 0) {
            var shapesToDelete = game.findNecklaces(shapes);

            if (shapesToDelete.length > 0) {
              for (i=0; i < shapesToDelete.length; i++) {
                
                game.deleteShape(shapes[shapesToDelete[i]]);
              };      
            };
    };
  },

  updateCurrentState: function(x,y,newContent) {
    game.currentState[x][y] = newContent;
  },

  findShapes: function(x,y,colour,shapes,shape) {
    //var origin = [x][y];
    
    var shapeCrawler = function(x,y,colour,shape) {
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
    }

    var shapePush = function (x,y,colour,shape) {
      shapes[shape].push(x + "_" + y);
      game.findShapes(x,y,colour,shape);
    }

    if (typeof shape === 'undefined') {
        var shape = "one";
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
      shapePush(x,y,colour,"one");
    };

    if (game.currentState[x][y+1] === colour) {
      y++;
      shapePush(x,y,colour,"two");
    };

    if (game.currentState[x-1][y] === colour) {
      x--;
      shapePush(x,y,colour,"three");
    };

    if (game.currentState[x][y-1] === colour) {
      y--;
      shapePush(x,y,colour,"four");
    };
    
    return shapes;
    
  },

  findNecklaces: function(shapes) {
        
    var shapesToDelete = [],
        necklaces = {
          one: [],
          two: [],
          three: [],
          four: []
        };

    var processLiberties = function(position, shape) {

      var x = Number(position[0]);
      var y = Number(position[1]);


      if (game.currentState[x+1][y] === ".") {
        necklaces[shape].push(x+1 + "_" + y)
      };

      if (game.currentState[x][y+1] === ".") {
        necklaces[shape].push(x + "_" + (y+1))
      };

      if (game.currentState[x-1][y] === ".") {
        necklaces[shape].push(x-1 + "_" + y)
      };

      if (game.currentState[x][y-1] === ".") {
        necklaces[shape].push(x + "_" + (y-1))
      };

    };
    //debugger;
    for (var shape in shapes) {

      if (shapes[shape].length > 0) {

        for (var i = 0; i < shapes[shape].length; i++) {
          
          var position = shapes[shape][i].split("_");
          processLiberties(position, shape);
        };
        
        if (necklaces[shape].length === 0) {
          shapesToDelete.push(shape);
          console.log(shapesToDelete);

        };
      };
    };

    console.log(shapesToDelete);

    return shapesToDelete;
  },

  deleteShape: function(shape) {
    for (var i = 0; i < shape.length; i++) {
      var pos = shape[i].split("_");
      game.updateCurrentState(pos[0],pos[1],".");
      var id = "#" + (Number(pos[0])+1) + "_" + (Number(pos[1])+1);
      console.log(id);
      $(id).html("");
    };
  }

}


$(document).ready(function() {

  game.init();

  var black = true;
  
  $(".item").click(function(){
    // console.log("Hello click");
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
  });

});

