$(document).ready(function () {
  var puzzlePieces = {};
  var solvedPieces = {};

  function Piece(row, column) {
    this.index = row * 3 + column;
    this.backgroundPosition = column * -100 + "px " + row * -100 + "px";
    this.zIndex = Math.floor(Math.random() * 10) + 1;
  }

  Piece.prototype.shuffle = function () {
    this.x = Math.random() * 160 + 20;
    this.y = Math.random() * 160 + 20;
  };

  Piece.prototype.draw = function () {
    this.shuffle();
    $(".pieces > div")
      .eq(this.index)
      .addClass("piece puzzleImage")
      .css({
        "background-position": this.backgroundPosition,
        border: "",
        left: this.x,
        top: this.y,
        "z-index": this.zIndex,
      })
      .fadeIn();
  };

  Piece.prototype.hide = function () {
    $(".pieces > div").eq(this.index).removeClass("selectedPiece").fadeOut();
  };

  function SolvedPiece(index, placedIndex) {
    this.index = index;
    this.placedIndex = placedIndex;
  }

  SolvedPiece.prototype.place = function (index) {
    this.placedIndex = index;
    this.backgroundPosition = puzzlePieces[index].backgroundPosition;
    $(".solvedPieces > div")
      .eq(this.index)
      .addClass("puzzleImage")
      .css({ "background-position": this.backgroundPosition });
  };

  SolvedPiece.prototype.remove = function () {
    this.placedIndex = -1;
    $(".solvedPieces > div")
      .eq(this.index)
      .removeClass("puzzleImage")
      .css({ "background-position": "" });
  };

  function puzzleCompleted() {
    if ($(".solvedPieces > .puzzleImage").length < 9) return false;

    for (var i = 0; i < 9; i++) {
      var sPiece = solvedPieces[i];
      if (sPiece.index != sPiece.placedIndex) return false;
    }

    return true;
  }

  function showMessage(message) {
    $("#message").html(message).fadeIn().delay(1000).fadeOut();
  }

  function finishPuzzle() {
    for (var i = 0; i < 9; i++) {
      var sPiece = solvedPieces[i];
      sPiece.remove();
    }

    var xdiff =
      $(".solvedPieces").position().left - $(".pieces").position().left;
    var ydiff = $(".solvedPieces").position().top - $(".pieces").position().top;

    for (var i = 0; i < 9; i++) {
      var left = xdiff + (i % 3) * 100;
      var top = ydiff + Math.floor(i / 3) * 100;
      $(".pieces > div")
        .eq(i)
        .show(0)
        .css("border", "1px solid #ccc")
        .animate(
          { left: left + "px", top: top + "px" },
          600,
          (function (x, y) {
            return function () {
              $(this).hide(0);
              x.place(y);
            };
          })(solvedPieces[i], i)
        );
    }
    setTimeout(function () {
      showMessage("Finished!");
    }, 600);
  }

  function loadPuzzle() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        puzzlePieces[i * 3 + j] = new Piece(i, j);
        puzzlePieces[i * 3 + j].draw();
        solvedPieces[i * 3 + j] = new SolvedPiece(i * 3 + j, -1);
      }
    }

    $(".pieces > div").click(function () {
      if ($(".selectedPiece").length > 0)
        $(".selectedPiece").removeClass("selectedPiece");
      $(this).addClass("selectedPiece");
    });

    $(".solvedPieces > div").click(function () {
      var solvedIndex = $(".solvedPieces > div").index(this);
      if (
        $(".selectedPiece").length > 0 &&
        solvedPieces[solvedIndex].placedIndex == -1
      ) {
        var selectedIndex = $(".pieces > div").index($(".selectedPiece"));
        puzzlePieces[selectedIndex].hide();
        solvedPieces[solvedIndex].place(selectedIndex);
      } else if (solvedPieces[solvedIndex].placedIndex != -1) {
        var index = solvedPieces[solvedIndex].placedIndex;
        puzzlePieces[index].draw();
        solvedPieces[solvedIndex].remove();
      }
      if (puzzleCompleted()) {
        showMessage("Congratulations!");
      }
    });

    $("#solvePuzzle").click(finishPuzzle);
  }

  loadPuzzle();
});
