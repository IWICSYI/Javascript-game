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