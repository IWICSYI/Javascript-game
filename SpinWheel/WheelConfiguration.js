
    	var myWheel = new Winwheel({
		    'canvasId'        : 'myCanvas',
		    'numSegments'       : 8,                 // Specify number of segments.
             'outerRadius'       : 200,               // Set outer radius so wheel fits inside the background.
             'drawText'          : true,              // Code drawn text can be used with segment images.
             'textFontSize'      : 16,
             'textOrientation'   : 'curved',
             'textAlignment'     : 'outer',
             'textMargin'        : -10,
             'textFontFamily'    : 'monospace',
             'textStrokeStyle'   : 'black',
              'textLineWidth'     : 3,
              'textFillStyle'     : 'white',
              'drawMode'          : 'segmentImage',
		    'segments'        :             // Set segment text
		    [
		         {'image' : 'images/placeholder1.png',  'text' : 'Crossword', 'link':'../Crossword/crossWord.html'},
		         {'image' : 'images/placeholder2.png',   'text' : 'WordSearch','link':'../WordSearch/wordSearch.html'},
		         {'image' : 'images/placeholder3.png',  'text' : 'MemoryMatch','link':'../MemoryMatch/memoryMatch.html'},
		         {'image' : 'images/placeholder4.png',  'text' : 'placeholder4','link':'../Crossword/crossWord.html'},
		         {'image' : 'images/placeholder5.png', 'text' : 'Crossword','link':'../Crossword/crossWord.html'},
		         {'image' : 'images/placeholder6.png', 'text' : 'WordSearch','link':'../WordSearch/wordSearch.html'},
		         {'image' : 'images/placeholder7.png',  'text' : 'MemoryMatch','link':'../MemoryMatch/memoryMatch.html'},
		         {'image' : 'images/placeholder8.png', 'text' : 'placeholder8','link':'../Crossword/crossWord.html'}
		 	 ],
		 	    'animation' :           // Specify the animation to use.
		                {
		                    'type'     : 'spinToStop',
		                    'duration' : 5,     // Duration in seconds.
		                    'spins'    : 8,     // Number of complete spins.
		                    'callbackFinished' : redirectToGame
		                }
            });
	        var wheelPower    = 2;
	        var wheelSpinning = false;

// -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin()
            {
                // Ensure that spinning can't be clicked again while already running.
                if (wheelSpinning == false)
                {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (wheelPower == 1)
                    {
                        myWheel.animation.spins = 3;
                    }
                    else if (wheelPower == 2)
                    {
                        myWheel.animation.spins = 8;
                      
                    }
                    else if (wheelPower == 3)
                    {
                        myWheel.animation.spins = 15;
                    }

                  

                    // Begin the spin animation by calling startAnimation on the wheel object.
                    myWheel.startAnimation();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    wheelSpinning = true;
                }
            }
             function redirectToGame(indicatedSegment)
            {
                // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
                alert(indicatedSegment.link + 'triggered');
                window.location.replace(indicatedSegment.link);

            }

   
