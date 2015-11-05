var game = {

  init: function(size) {
    game.CurrentState = game.initialState(size);
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
  }
}


$(document).ready(function() {

  game.init();

});

