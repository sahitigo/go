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

    var shapes = game.findShapes(x,y,colour);
    
    if (shapes) {
      var necklaces = game.findNecklace(shapes);
      if (necklaces) {
        game.deleteShapes(necklaces);
      }
    }
  },

  updateCurrentState: function(x,y,colour) {
    game.currentState[x][y] = colour;
  }


}


$(document).ready(function() {

  game.init();

});

