var game = {

  currentState: [],

  init: function(size) {
    game.currentState = game.initialState(size);
    console.log(game.CurrentState);
  },

  initialState: function(size) {
    size = (typeof size === 'undefined') ? 9 : size; // Default to 9x9 grid
    grid = _.range(size).map(function () {
      return _.range(size).map(function () {
        return '.';
      });
    });
    return grid;
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

});

