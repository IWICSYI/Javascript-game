/**
 * Wordfind.js 0.0.1
 * (c) 2012 Bill, BunKat LLC.
 * Wordfind is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/wordfind
 */

(function(document, $, wordfind) {

    'use strict';

    /**
     * An example game using the puzzles created from wordfind.js. Click and drag
     * to highlight words.
     *
     * WordFindGame requires wordfind.js and jQuery.
     */

    /**
     * Initializes the WordFindGame object.
     *
     * @api private
     */
    var WordFindGame = function() {

        // List of words for this game
        var wordList;

        /**
         * Draws the puzzle by inserting rows of buttons into el.
         *
         * @param {String} el: The jQuery element to write the puzzle to
         * @param {[[String]]} puzzle: The puzzle to draw
         */
        var drawPuzzle = function(el, puzzle) {

            var output = '';
            // for each row in the puzzle
            for (var i = 0, height = puzzle.length; i < height; i++) {
                // append a div to represent a row in the puzzle
                var row = puzzle[i];
                output += '<div>';
                // for each element in that row
                for (var j = 0, width = row.length; j < width; j++) {
                    // append our button with the appropriate class
                    output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
                    output += row[j] || '&nbsp;';
                    output += '</button>';
                }
                // close our div that represents a row
                output += '</div>';
            }

            $(el).html(output);
        };

        /**
         * Draws the words by inserting an unordered list into el.
         *
         * @param {String} el: The jQuery element to write the words to
         * @param {[String]} words: The words to draw
         */
        var drawWords = function(el, wordObj) {

            var output = '<ul>';

            for (var word in wordObj) {
                var definition = wordObj[word];
                output += '<li class="word ' + "wf_" + word + '">' + definition + '</li>';
            }
            output += '</ul>';

            $(el).html(output);
        };


        /**
         * Game play events.
         *
         * The following events handle the turns, word selection, word finding, and
         * game end.
         *
         */

        // Game state
        var startSquare, selectedSquares = [],
            curOrientation, curWord = '';

        /**
         * Event that handles mouse down on a new square. Initializes the game state
         * to the letter that was selected.
         *
         */
        var startTurn = function() {
            $(this).addClass('selected');
            startSquare = this;
            selectedSquares.push(this);
            curWord = $(this).text();
        };



        /**
         * Event that handles mouse over on a new square. Ensures that the new square
         * is adjacent to the previous square and the new square is along the path
         * of an actual word.
         *
         */
        var select = function(target) {
            // if the user hasn't started a word yet, just return
            if (!startSquare) {
                return;
            }

            // if the new square is actually the previous square, just return
            var lastSquare = selectedSquares[selectedSquares.length - 1];
            if (lastSquare == target) {
                return;
            }

            // see if the user backed up and correct the selectedSquares state if
            // they did
            var backTo;
            for (var i = 0, len = selectedSquares.length; i < len; i++) {
                if (selectedSquares[i] == target) {
                    backTo = i + 1;
                    break;
                }
            }

            while (backTo < selectedSquares.length) {
                $(selectedSquares[selectedSquares.length - 1]).removeClass('selected');
                selectedSquares.splice(backTo, 1);
                curWord = curWord.substr(0, curWord.length - 1);
            }


            // see if this is just a new orientation from the first square
            // this is needed to make selecting diagonal words easier
            var newOrientation = calcOrientation(
                $(startSquare).attr('x') - 0,
                $(startSquare).attr('y') - 0,
                $(target).attr('x') - 0,
                $(target).attr('y') - 0
            );

            if (newOrientation) {
                selectedSquares = [startSquare];
                curWord = $(startSquare).text();
                if (lastSquare !== startSquare) {
                    $(lastSquare).removeClass('selected');
                    lastSquare = startSquare;
                }
                curOrientation = newOrientation;
            }

            // see if the move is along the same orientation as the last move
            var orientation = calcOrientation(
                $(lastSquare).attr('x') - 0,
                $(lastSquare).attr('y') - 0,
                $(target).attr('x') - 0,
                $(target).attr('y') - 0
            );

            // if the new square isn't along a valid orientation, just ignore it.
            // this makes selecting diagonal words less frustrating
            if (!orientation) {
                return;
            }

            // finally, if there was no previous orientation or this move is along
            // the same orientation as the last move then play the move
            if (!curOrientation || curOrientation === orientation) {
                curOrientation = orientation;
                playTurn(target);
            }

        };

        var touchMove = function(e) {
            var xPos = e.originalEvent.touches[0].pageX;
            var yPos = e.originalEvent.touches[0].pageY;
            var targetElement = document.elementFromPoint(xPos, yPos);
            select(targetElement);
        };

        var mouseMove = function() {
            select(this);
        };

        /**
         * Updates the game state when the previous selection was valid.
         *
         * @param {el} square: The jQuery element that was played
         */
        var playTurn = function(square) {

            // make sure we are still forming a valid word
            for (var i = 0, len = wordList.length; i < len; i++) {
                if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
                    $(square).addClass('selected');
                    selectedSquares.push(square);
                    curWord += $(square).text();
                    break;
                }
            }
        };

        /**
         * Event that handles mouse up on a square. Checks to see if a valid word
         * was created and updates the class of the letters and word if it was. Then
         * resets the game state to start a new word.
         *
         */
        var endTurn = function() {

            // see if we formed a valid word
            for (var i = 0, len = wordList.length; i < len; i++) {

                if (wordList[i] === curWord) {
                    $('.selected').addClass('found');
                    wordList.splice(i, 1);
                    $('.' + "wf_" + curWord).addClass('wordFound').html(curWord);

                    completeWordHandler(curWord);
                }
                //signal end of game
                if (wordList.length === 0) {
                    $('.puzzleSquare').addClass('complete');
                    alert("complete");
                }
            }

            // reset the turn
            $('.selected').removeClass('selected');
            startSquare = null;
            selectedSquares = [];
            curWord = '';
            curOrientation = null;
        };

        /**
         * Event handler fired after complete a word just for add callback
         *
         *@param {String} completed word
         */
        var completeWordHandler = function(word) {

        };

        /**
         * Given two points, ensure that they are adjacent and determine what
         * orientation the second point is relative to the first
         *
         * @param {int} x1: The x coordinate of the first point
         * @param {int} y1: The y coordinate of the first point
         * @param {int} x2: The x coordinate of the second point
         * @param {int} y2: The y coordinate of the second point
         */
        var calcOrientation = function(x1, y1, x2, y2) {

            for (var orientation in wordfind.orientations) {
                var nextFn = wordfind.orientations[orientation];
                var nextPos = nextFn(x1, y1, 1);

                if (nextPos.x === x2 && nextPos.y === y2) {
                    return orientation;
                }
            }

            return null;
        };
        /**
         *Return sorted wordList
         *
         *@param {Array|Object} words: array or object of words and definitions.
         *
         */
        var getWordList = function(words) {
            if ($.isArray(words)) {
                return words.slice(0).sort();
            } else if ($.isPlainObject(words)) {
                var keys = [];
                for (var key in words) {
                    keys.push(key);
                }
                return keys.slice(0).sort();
            }
        };
        /**
         *Return object of word:definition
         *
         *@param {Array|Object} words: array or object of words and definitions.
         *
         */
        var getWordObj = function(words) {
            if ($.isArray(words)) {
                var wordObj = {};
                for (var i in words) {
                    wordObj[words[i]] = words[i];
                }
                return wordObj;
            } else if ($.isPlainObject(words)) {
                return words;
            }
        };
        return {

            /**
             * Creates a new word find game and draws the board and words.
             *
             * Returns the puzzle that was created.
             *
             * @param {[String]} words: The words to add to the puzzle
             * @param {String} puzzleEl: Selector to use when inserting the puzzle
             * @param {String} wordsEl: Selector to use when inserting the word list
             * @param {Options} options: WordFind options to use when creating the puzzle
             */
            create: function(words, puzzleEl, wordsEl, options) {


                var wordObj = getWordObj(words);
                wordList = getWordList(words);
                window.test = wordList;
                (document.test = wordList);
                var puzzle = wordfind.newPuzzle(wordList, options);

                // draw out all of the words
                drawPuzzle(puzzleEl, puzzle);

                drawWords(wordsEl, wordObj);

                // attach events to the buttons
                // optimistically add events for windows 8 touch
                if (window.navigator.msPointerEnabled) {
                    $('.puzzleSquare').on('pointerdown', startTurn);
                    $('.puzzleSquare').on('pointerover', select);
                    $('.puzzleSquare').on('pointerup', endTurn);
                    $('.puzzleSquare').mousedown(startTurn);
                    $('.puzzleSquare').mouseenter(mouseMove);
                    $('.puzzleSquare').mouseup(endTurn);
                } else {
                    $('.puzzleSquare').mousedown(startTurn);
                    $('.puzzleSquare').mouseenter(mouseMove);
                    $('.puzzleSquare').mouseup(endTurn);
                    $('.puzzleSquare').on("touchstart", startTurn);
                    $('.puzzleSquare').on("touchmove", touchMove);
                    $('.puzzleSquare').on("touchend", endTurn);
                }

                return puzzle;
            },

            /**
             * Solves an existing puzzle.
             *
             * @param {[[String]]} puzzle: The puzzle to solve
             * @param {[String]} words: The words to solve for
             */
            solve: function(puzzle, words) {

                var solution = wordfind.solve(puzzle, words).found;

                for (var i = 0, len = solution.length; i < len; i++) {
                    var word = solution[i].word,
                        orientation = solution[i].orientation,
                        x = solution[i].x,
                        y = solution[i].y,
                        next = wordfind.orientations[orientation];

                    if (!$('.' + word).hasClass('wordFound')) {
                        for (var j = 0, size = word.length; j < size; j++) {
                            var nextPos = next(x, y, j);
                            $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass('solved');
                        }

                        $('.' + word).addClass('wordFound');
                    }
                }

            },
            /**
             * Add complete word callback.
             *
             * @param {function(string)} call: callback function.
             */
            onClompleteWord: function(call) {
                if (typeof call == "function") {
                    completeWordHandler = call;
                } else {
                    console.error("onClompleteWord expexted a function!");
                }
            }
        };
    };


    /**
     * Allow game to be used within the browser
     */
    window.wordfindgame = WordFindGame();

}(document, jQuery, wordfind));