// Supporting routines for tictactoe.html.

var base = "images/";
var blankImg = base + "blank.png";
var images = Array(base + "x.png", base + "o.png");
var DIM = 3;
var OBASE = "ttt";

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
	var r, c, obj, oid;

	try {
		for (r=0; r<DIM; r++) {
			for (c=0; c<DIM; c++) {
				this[r][c] = null;
				document.getElementById(this.mkId(r,c)).src = blankImg;
			};
		};
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
	return new Array(a[1], a[2]);
};

// Throw an exception if we receive an invalid pair of coordinates.
Board.prototype.checkRange(c,r) {
	if ((c < 0) || (r < 0) || (c >= DIM) || (r >= DIM)) {
		throw("Coordinates out of range: '" + c + "," + r + "'");
	}
};

// Set the value at coordinates c and r to player and load the correct
// image into the table.
Board.prototype.move = function(player, c, r) {
	this.checkRange(c, r);
	if (typeof(this[c][r]) == "number") {
		return false;
	}
	this[c][r] = player;
	document.getElementById(this.mkId(r,c)).src = images[player];
};

Board.prototype.moveId = function(player, id) {
	var coords;

	coords = this.parseId(id)
	this.move(player, Number(coords[0]), coords[1]);
};

var board = null;

function setup() {
	board = new Board();
};


function userMove(img) {
	img.src = xImg;
	return true;
}
