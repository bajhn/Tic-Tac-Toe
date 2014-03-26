// Supporting routines for tictactoe.html.

var base = "images/";
var blankImg = base + "blank.png";
var images = Array(base + "x.png", base + "o.png");
var DIM = 3;
var MOVELIM = DIM * DIM;
var OBASE = "ttt";
var gameActive = false;
var curPlayer = null;
var moves = 0;

// Unnecessary semicolons included at the end of function definitions
// to make the EMACS syntax checker happy.

/* We have two players, 0 and 1 representing 'X' and 'O'.
 */

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
		moves = 0
	}
	catch (e) {
		alert("In reset(): " + e);
	}
};

// Assemble an element id from column and row numbers.
Board.prototype.mkId = function(c,r) {
	return OBASE + r + "_" + c;
};

// TO-DO: Assemble regular expression pattern using OBASE.
Board.prototype.re = RegExp(/(\d+)_(\d+)/);

// Return an array containg column and row numbers from an element ID.
// TO-DO: Add error checking to guard against HTML errors.
Board.prototype.parseId = function(id) {
	var a;

	a = this.re.exec(id);
	return new Array(Number(a[1]), Number(a[2]));
};

// Throw an exception if we receive an invalid pair of coordinates.
Board.prototype.checkRange = function(c,r) {
	if ((c < 0) || (r < 0) || (c >= DIM) || (r >= DIM)) {
		throw "Coordinates out of range: '" + c + "," + r + "'";
	}
};

// Set the value at coordinates c and r to player and load the correct
// image into the table.
Board.prototype.move = function(player, c, r) {
	if (gameActive) {
		this.checkRange(c, r);
		if (typeof(this[c][r]) == "number") {
			return false;
		}
		this[c][r] = player;
		document.getElementById(this.mkId(r,c)).src = images[player];
		moves++;
		if (moves >= MOVELIM) {
			gameActive = false;
		}
	}
	else {
		alert("No game in progress");
	}
};

Board.prototype.moveId = function(player, id) {
	var coords, i;

	// alert("moveID("+player+", "+id+")");
	coords = this.parseId(id)
	this.move(Number(player), coords[0], coords[1]);
};

// The board is made up of vectors, which we define as being an array
// of arrays containing column and vector.
Board.prototype.scoreVector = function (player, v) {
	var i, val, coords;
	var tally = 0;

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

Board.prototype.checkGame = function() {
	var r, c, player, v, score, e;

	if (gameActive) {
		try {
			for (player=0; player<2; player++) {
				// Check horizontals first.
				for (r=0; r<DIM; r++) {
					v = new Array(DIM);
					for (c=0; c<DIM; c++) {
						v[c] = new Array(r,c);
					}
					if (this.scoreVector(player, v) == DIM) {
						throw 'winner';
					}
				}
				// Check verticals.
				for (c=0; c<DIM; c++) {
					v = new Array(DIM);
					for (r=0; r<DIM; r++) {
						v[r] = new Array(r,c);
					}
					if (this.scoreVector(player, v) == DIM) {
						throw 'winner';
					}
				}
				// Check diagnonals.
				v = new Array(DIM);
				for (c=0; c<DIM; c++) {
					v[c] = new Array(c, c);
				}
				if (this.scoreVector(player, v) == DIM) {
					throw 'winner';
				}
				v = new Array(DIM);
				for (r=DIM-1, c=0; r>=0, c<DIM; r--, c++) {
					v[c] = new Array(r, c);
				}
				if (this.scoreVector(player, v) == DIM) {
					throw 'winner';
				}
			}
		}
		catch (e) {
			if (e == "winner") {
				alert("Player "+player+" is the winner!");
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
