var Pawn = new Worker('pawn.js');
var Checkmate = new Firebase('https://26queens.firebaseio.com/');

//Pawn Dispatchers
var dispatchPawn = function(action, board) {
  Pawn.postMessage({
    type: action,
    board: [board[0], board[1], board[2]]
  });
};

var playqueens = function(snapshot) {
  console.log('Getting board from Firebase');
  var boardObj = snapshot.val();
  var job = (boardObj.priority === 6) ? 'breathe' : 'dive';
  dispatchPawn(job, boardObj.board);
};

//Pawn handlers for shooting to Firebase
Pawn.onmessage = function(message) {
  switch (message.data.type) {
    case 'solutions':
      console.log("Recovered %d solutions from Pawn", message.data.package.solutions, message.data.package.board);
      // TODO: send these somewhere
      break;
    case 'widened':
      console.log("Pawn Returned some boards: ", message.data.package.source, message.data.package.boards);
      message.data.package.boards.forEach(function(board) {
        Checkmate.push().setWithPriority({
          board: {
            0: board[0],
            1: board[1],
            2: board[2]
          }
        }, 1, function(err) {
          err || console.log("Pushed board to Firebase");
          Checkmate.once('child_added', playqueens);
        });
      });
      break;
    default:
      throw new Error ("Invalid message from Pawn");
  }
};

Pawn.onerror = function(e) {
  console.log(e);
};