





function initializeRecycleBin()
{
		const recycleBinsInfo=
		[
			{
				'binName':'paper',
				'img':'img/paper.png'
			},
			{
				'binName':'glass',
				'img':'img/glass.png'
			},
			{
				'binName':'plastic',
				'img':'img/plastic.png'
			},
			{
				'binName':'whatever',
				'img':'img/whatever.png'
			},

		];

	    var recycleBinArea = document.getElementById("recycleBinArea");


       
        var recycleBinsHTMLArrays=buildHTMLElement(recycleBinsInfo);
        
        // remove all exisiting classes from each card
        for (var i = 0; i < recycleBinsHTMLArrays.length; i++)
        {
            recycleBinsHTMLArrays[i].classList.add("dropzone");
            recycleBinArea.appendChild(recycleBinsHTMLArrays[i]);
		}

}

	document.body.onload=initializeRecycleBin();

function buildHTMLElement(arrayInfo)
{
	 	  var htmlArrayBuilder=[];
	 	   arrayInfo = shuffle(arrayInfo);

          for(var i = 0; i < arrayInfo.length; i++){
    	  
      	  // Create a div
      		  const htmlElement = document.createElement('div');

      		  // Apply a card class to that div
      		  //htmlElement.classList.add('bin1');
      		 
      		  // Set the data-name attribute of the div to the cardsArray name
      		  htmlElement.name = arrayInfo[i].binName;
      		  htmlElement.style.backgroundImage = 'url('+arrayInfo[i].img+')';
      		  // Create front of card
      		  
      		 
      		  htmlArrayBuilder.push(htmlElement);
    		}
    		//);
    	  
    	    return htmlArrayBuilder;
}


function shuffle(array) 
{
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
}	


// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;