// Supporting routines for tictactoe.html.

var base = "images/";
var blankImg = base + "blank.png";
var images = Array(base + "x.png", base + "o.png");
var DIM = 3;
var MOVELIM = DIM * DIM;
var VECTORCNT = (2 * DIM) + 2;
var OBASE = "ttt";
var gameActive = false;
var curPlayer = null;
var moves = 0;
var ready = true;

// Unnecessary semicolons included at the end of function definitions
// to make the EMACS syntax checker happy.

/* We have two players, 0 and 1 representing 'X' and 'O'.
 */

// A ScoresArray is a list of lists of vector indices.  See the play
// method for an example of what it looks like.
function ScoresArray() {
	var i, j, sa;

	Array.call(this);

	for (i=0; i<this.length; i++) {
		sa = this[i] = new Array(VECTORCNT);
		for (j=0; j<VECTORCNT; j++) {
			sa[j] = -1;
		}
	}
}

ScoresArray.prototype = new Array(DIM);
ScoresArray.prototype.constructor = ScoresArray;

// Insert index into the first available slot under score.
ScoresArray.prototype.insert = function (score, index) {
	var i;

	// alert('insert('+score+', '+index+')');
	i = this[score].indexOf(-1);
	if (i == -1) {
		throw 'Array full or uninitialized';
	}
	this[score][i] = index;
	// alert('inserted '+index);
};

// Return the number of indices stored under score.
ScoresArray.prototype.countScore = function (score) {
	return this[score].indexOf(-1);
};

// Find the score of a specific vector index.
ScoresArray.prototype.scoreByIndex = function (idx) {
	var s, i;

	for (s=0; s<this.length; s++) {
		for (i=0; this[s].length; i++) {
			if (this[s][i] == idx) {
				return s;
			}
			if (this[s][i] == -1) {
				break;
			}
		}
	}
	alert('scoreByIndex did not find a score for vector '+idx);
	return -1;
};

// Board class to represent the tic-tac-toe board

function Board() {
	var i, j;

	Array.call(this);
	for (i=0; i<DIM; i++) {
		this[i] = new Array(DIM);
	};
	this.reset();
};
Board.prototype = new Array(DIM);
Board.prototype.constructor = Board;
Board.prototype.reset = function ()  {
	var r, c, obj, oid, e;

	try {
		for (r=0; r<DIM; r++) {
			for (c=0; c<DIM; c++) {
				this[r][c] = null;
				document.getElementById(this.mkId(r,c)).src = blankImg;
			};
		};
		gameActive = true;
		moves = 0;
		this.mkVectors();
	}
	catch (e) {
		alert("In reset(): " + e);
	}
};

// Run a cycle of the game when a square is clicked.
Board.prototype.runGame = function (elId) {
	if (gameActive) {
		if (ready) {
			ready = false;
		}
		else {
			return;
		}
		// After debugging, put the rest of this block in a try/catch
		// block so that waiting can be unlocked.
		this.moveId(curPlayer, elId);
		this.checkGame();
		if (gameActive) {
			if (curPlayer == 0) {
				this.playO(Number(!curPlayer));
			}
			else {
				alert("I don't know how to play as X yet.");
			}
			this.checkGame();
		}
		ready = true;
	}
	else {
		alert("No game in progress");
	}
};

// Return true if the square at coords doesn't have a number in it.
Board.prototype.notSet = function (coords) {
	return (typeof(this[coords[0]][coords[1]]) != "number");
};

// Assemble an element id from column and row numbers.
Board.prototype.mkId = function (r, c) {
	return OBASE + r + "_" + c;
};

// TO-DO: Assemble regular expression pattern using OBASE.
Board.prototype.re = RegExp(/(\d+)_(\d+)/);

// Return an array containg column and row numbers from an element ID.
// TO-DO: Add error checking to guard against HTML errors.
Board.prototype.parseId = function (id) {
	var a;

	a = this.re.exec(id);
	return new Array(Number(a[1]), Number(a[2]));
};

// Throw an exception if we receive an invalid pair of coordinates.
Board.prototype.checkRange = function (r, c) {
	if ((c < 0) || (r < 0) || (c >= DIM) || (r >= DIM)) {
		throw "Coordinates out of range: '" + c + "," + r + "'";
	}
};

// Set the value at coordinates r and c to player and load the correct
// image into the table.
Board.prototype.move = function (player, r, c) {
	if (gameActive) {
		this.checkRange(r, c);
		if (typeof(this[r][c]) == "number") {
			alert("This square has already been played");
			return false;
		}
		this[r][c] = player;
		document.getElementById(this.mkId(r,c)).src = images[player];
		moves++;
		if (moves >= MOVELIM) {
			gameActive = false;
		}
		return true;
	}
	else {
		alert("No game in progress");
		return false;
	}
};

Board.prototype.moveId = function (player, id) {
	var coords, i;

	// alert("moveID("+player+", "+id+")");
	coords = this.parseId(id)
	return this.move(Number(player), coords[0], coords[1]);
};

// The board is made up of vectors, which we define as being an array
// of arrays containing column and vector.
Board.prototype.scoreVector = function (player, v) {
	var i, val, coords;
	var tally = 0;

	// alert('scoreVector(' + player + ', ' + v + ')');
	for (i=0; i<v.length; i++) {
		coords = v[i];
		val = this[coords[0]][coords[1]];
		if (typeof(val) != "number") {
			continue;
		}
		if (val == player) {
			tally++;
		}
	};
	return tally;
};

// Create a list of vectors to check scoring and strategize.
Board.prototype.mkVectors = function () {
	var r, c, v, i=0;

	this.vectors = new Array(VECTORCNT);
	// Create horizontals first.
	for (r=0; r<DIM; r++) {
		v = new Array(DIM);
		for (c=0; c<DIM; c++) {
			v[c] = new Array(r,c);
		}
		this.vectors[i] = v;
		i++;
	}
	// Create verticals.
	for (c=0; c<DIM; c++) {
		v = new Array(DIM);
		for (r=0; r<DIM; r++) {
			v[r] = new Array(r,c);
		}
		this.vectors[i] = v;
		i++;
	}
	// Create diagonals.
	v = new Array(DIM);
	for (c=0; c<DIM; c++) {
		v[c] = new Array(c, c);
	}
	this.vectors[i] = v;
	i++;
	v = new Array(DIM);
	for (r=DIM-1, c=0; r>=0, c<DIM; r--, c++) {
		v[c] = new Array(r, c);
	}
	this.vectors[i] = v;
};

// Return the value found in row & column using vector array element
// (an array containing column and row).
Board.prototype.getSquare = function (a) {
	return this[a[0]][a[1]];
};

// Sets the first empty square in vector referenced by vidx to player
// ID.  Returns true if an empty square was set and false if not.
Board.prototype.setFirstEmpty = function (vidx, player) {
	var i, coords, result, v;

	// alert("setFirstEmpty "+vidx+" "+player);
	v = this.vectors[vidx];
	for (i=0; i<v.length; i++) {
		coords = v[i];
		val = this[coords[0]][coords[1]];
		if (this.notSet(coords)) {
			this.move(player, coords[0], coords[1]);
			// alert('Set player '+player+' at '+coords);
			return true;
		}
		// else alert('Coords '+coords+' appear to be set');
	}
	return false;
};

// Sets the first available edge square in the vector referenced by
// vidx to player ID.  Returns true if it was able to do so.
Board.prototype.setEdge = function (vidx, player) {
	var coords, v;

	v = this.vectors[vidx];
	for (i=0; i<v.length; i++) {
		coords = v[i];
		if ((((coords[0] + coords[1]) % 2) == 1) && this.notSet(coords)) {
			this.move(player, coords[0], coords[1]);
			return true;
		}
	}
	return false;
};

// Sets the center square in the board if it is part of the vector
// referenced by vidx and returns true if successful.
Board.prototype.setCenter = function (vidx, player) {
	var coords, v;

	v = this.vectors[vidx];
	coords = v[2];
	if (((coords[0] == 2) && (coords[1] == 2)) &&	 this.notSet(coords)) {
			this.move(player, 2, 2);
			return true;
	}
	return false;
};

// Sets the first available corner square in the vector referenced by
// vidx and returns true if successful.
Board.prototype.setCorner = function (vidx, player) {
	var coords, v;

	v = this.vectors[vidx];
	for (i=0; i<v.length; i++) {
		coords = v[i];
		if ((((coords[0] + coords[1]) % 2) == 0) && this.notSet(coords)) {
			this.move(player, coords[0], coords[1]);
			return;
		}
	}
	return false;
};

// This is written for a three-squared tic-tac-toe, and it probably
// doesn't work for a four-squared game.  It may only work for the
// defensive (O) side.
Board.prototype.playO = function (player) {
	var opponent = (player == 0) ? 1 : 0;
	var pScores = new ScoresArray(DIM);
	var oScores = new ScoresArray(DIM);
	var i, j, v, s, vidx, sa, coords, olen, plen;

	// alert("playO: "+player);
	if (!gameActive) {
		return;
	}
	// Calculate the scores for both players in all vectors and
	// collate the vector indices according to the score for each
	// player.  For example, pScores may look like this:
	// pScores[0] = [1,2,4,5,7]
	// pScores[1] = [0,3]
	// pScores[2] = [6]
	// In this example, player has not selected any squares in vectors
	// 1, 2, 4, 5, or 7, and he has selected one square in vectors
	// 0 and 3, and two squares in vector 6.  Assuming the opponent
	// doesn't have any squares selected in vector 6, player can win
	// by filling in the remaining square in vector 6.
	for (i=0; i<this.vectors.length; i++) {
		// alert("i="+i+" this.vectors[i]="+this.vectors[i]);
		v = this.vectors[i];
		s = this.scoreVector(player, v);
		// alert("Player "+player+" score in vector "+i+": "+s);
		pScores.insert(s, i);
		s = this.scoreVector(opponent, v);
		// alert("Player "+opponent+" score in vector "+i+": "+s);
		oScores.insert(s, i);
	}

	// See if we can win right now.
	plen = pScores.countScore(2);
	for (i=0; i<plen; i++) {
		vidx = pScores[2][i];
		if (oScores.scoreByIndex(vidx) == 0) {
			// Opponent has no squares in this vector.
			if (this.setFirstEmpty(vidx, player)) {
				return;
			}
		}
	}
	// No such luck. Play defense.  If there is a vector with the
	// opponent's score of 2 and my score there is 0, set the empty
	// square to block him and return.
	olen = oScores.countScore(2);
	for (i=0; i<olen; i++) {
		vidx = oScores[2][i];
		if (pScores.scoreByIndex(vidx) == 0) {
			if (this.setFirstEmpty(vidx, player)) {
				return;
			}
		}
	}
	// Good, we don't have to play defense.  Try offense.  First, see
	// if there is a vector where the opponent's score is 1, and if it
	// is, set a side square adjacent to his corner square and return.
	olen = oScores.countScore(1);
	for (i=0; i<olen; i++) {
		vidx = oScores[1][i];
		if (pScores.scoreByIndex(vidx, player) == 0) {
			if (this.setEdge(vidx, player)) {
				return;
			}
			else if (this.setCenter(vidx, player)) {
				return;
			}
			else if (this.setCorner(vidx, player)) {
				return;
			}
		}
	}
	// If we didn't do that, then set a side square or the middle
	// square.
	plen = pScores.countScore(0);
	for (i=0; i<plen; i++) {
		vidx = pScores[0][i];
		if (this.setSide(this.vectors[vidx], player)) {
			return;
		}
	}
	alert("Method play() fell off the end!");
};

Board.prototype.playX = function (player) {
	var i, v, s;
	var opponent = (player == 0) ? 1 : 0;
	var pScores = new ScoresArray(DIM);
	var oScores = new ScoresArray(DIM);

	alert("playX: "+player);
	if (!gameActive) {
		return;
	}
	// Opening gambit
	if (moves == 0) {
		this.move(player, 0, 0);
		return;
	}
	for (i=0; i<this.vectors.length; i++) {
		// alert("i="+i+" this.vectors[i]="+this.vectors[i]);
		v = this.vectors[i];
		s = this.scoreVector(player, v);
		// alert("Player "+player+" score in vector "+i+": "+s);
		pScores.insert(s, i);
		s = this.scoreVector(opponent, v);
		// alert("Player "+opponent+" score in vector "+i+": "+s);
		oScores.insert(s, i);
	}
	// See if we can win right now.
	plen = pScores.countScore(2);
	for (i=0; i<plen; i++) {
		vidx = pScores[2][i];
		if (oScores.scoreByIndex(vidx) == 0) {
			// Opponent has no squares in this vector.
			if (this.setFirstEmpty(vidx, player)) {
				return;
			}
		}
	}
	// No such luck. Play defense.  If there is a vector with the
	// opponent's score of 2 and my score there is 0, set the empty
	// square to block him and return.
	olen = oScores.countScore(2);
	for (i=0; i<olen; i++) {
		vidx = oScores[2][i];
		if (pScores.scoreByIndex(vidx) == 0) {
			if (this.setFirstEmpty(vidx, player)) {
				return;
			}
		}
	}
	// Try offense.
}

Board.prototype.checkGame = function () {
	var i, player, e;

	if (gameActive) {
		try {
			for (player=0; player<2; player++) {
				for (i=0; i<this.vectors.length; i++) {
					if (this.scoreVector(player, this.vectors[i]) == DIM) {
						throw 'winner';
					}
				}
			}
		}
		catch (e) {
			if (e == "winner") {
				alert(((player == 0) ? "X" : "O")+" wins!");
				gameActive = false;
			}
			else {
				throw e;
			}
		}
	}
};

var board = null;

function setup() {
	board = new Board();
	curPlayer = 0;
};
