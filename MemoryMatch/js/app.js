'use strict';
//create closure so the global variables declared in this script will not be exposed
(function() 
{
    // Card data
    //Use dataSetName to match cards
    //Use id for different images for the same matching pair
    const cardsArray = 
      [{
        'dataSetName': 'chinese',
        'img': 'img/a.png',
        'id':'tutuKueh',
      },
      {
        'dataSetName': 'chinese',
        'img': 'img/a.png',
        'id':'chineseCuisine',
      },
      {
         'dataSetName': 'malay',
         'img': 'img/b.png',
         'id':'kueyTupak',
       },
       {
         'dataSetName': 'malay',
         'img': 'img/b.png',
         'id':'malayCuisine',

       },
     /*  {
         'dataSetName': 'indian',
         'img': 'img/c.png',
         'id':'indianCuisine',
       },
       {
         'dataSetName': 'indian',
         'img': 'img/c.png',
         'id':'rotiprata',
       },
       {
         'dataSetName': 'mexican',
         'img': 'img/d.png',
         'id':'mexicanCuisine',
       },
       {
         'dataSetName': 'mexican',
         'img': 'img/d.png',
         'id':'taco',
       },
       {
         'dataSetName': 'korean',
         'img': 'img/e.png',
          'id':'kimchi',
       },
       {
         'dataSetName': 'korean',
         'img': 'img/e.png',
          'id':'koreanCuisine',
       },
       {
         'dataSetName': 'japanese',
         'img': 'img/f.png',
          'id':'japaneseCuisine',
       },
       {
         'dataSetName': 'japanese',
         'img': 'img/f.png',
          'id':'sushi',
       },*/
      ];

    

   // cards array holds all cards
    let cards=buildDeck();
     // array for opened cards
    var openedCardsGlobal = [];
    // game timer
    var second = 0;
    var minute = 0; 
    var hour = 0;
    var timer = document.querySelector(".timer");
    var interval;

    function buildDeck()
      { 
         
          var cardsArrayBuilder=[];

          for(var i = 0; i < cardsArray.length; i++){
    	  
      	  // Create a div
      		  const card = document.createElement('li');

      		  // Apply a card class to that div
      		  card.classList.add('card');
      		 
      		  // Set the data-name attribute of the div to the cardsArray name
      		  card.dataset.name = cardsArray[i].dataSetName;
      		  card.id = cardsArray[i].id;
      		  card.style.backgroundImage = 'url('+cardsArray[i].img+')';
      		  // Create front of card
      		  
      		 
      		  cardsArrayBuilder.push(card);
    		}
    		//);
    	  
    	    return cardsArrayBuilder;
    	}

    




    function displayDeck()
    {
        const deck = document.getElementById("card-deck");
    	// shuffle deck
        cards = shuffle(cards);
        // remove all exisiting classes from each card
        for (var i = 0; i < cards.length; i++)
        {
            deck.innerHTML = "";
            [].forEach.call(cards, function(item) 
            {
                deck.appendChild(item);
            });
            //ie 11 does not allow mass classlist removal so have to seperate them one by one
            cards[i].classList.remove("show");
            cards[i].classList.remove("open");
            cards[i].classList.remove("match");
            cards[i].classList.remove("disabled");
            //make the picture in 0px to hide it without needing to remove it
          	cards[i].style.backgroundSize="0.0px";
        }
    }


    //function to get the cards that are already matched
    function matchedCardState()
    {
        let matchedCard = document.getElementsByClassName("match");
        return matchedCard;
    }




    // shuffles cards
    // @param {array}
    // @returns shuffledarray
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };


    // shuffles cards when page is refreshed / loads
    document.body.onload = startGame();




    // function to start a new play 
    function startGame(){
        displayDeck();
        addNeccessaryEventListeners(cards);
        

        // reset moves
        var movesStartWithZero=0
        let counter = document.querySelector(".moves");
        counter.innerHTML = movesStartWithZero;
      
        // reset rating
        let stars = document.querySelectorAll(".fa-star");
        for (var i= 0; i < stars.length; i++){
            stars[i].style.color = "#FFD700";
            stars[i].style.visibility = "visible";
        }
        //reset timer
        second = 0;
        minute = 0; 
        hour = 0;
        var timer = document.querySelector(".timer");
        timer.innerHTML = "0 mins 0 secs";
        clearInterval(interval);
    }



    //function to disable the same card from being choose twice by adding css classes that disable clicks.
    function displayCard()
    {

       
        this.classList.toggle("open");
        this.classList.toggle("show");
        this.classList.toggle("disabled");

    }


    // add opened cards to OpenedCards list and check if cards are matching or not
    function cardOpen() {
        //redisplay what is behind the cards by making a 0px size image became 150px.
      	this.classList.add("front");
      	this.style.backgroundSize="150px";
        
        openedCardsGlobal.push(this);
        var len = openedCardsGlobal.length;
       
        if(len === 2)
        {
            moveCounter();
            
            if(openedCardsGlobal[0].dataset.name === openedCardsGlobal[1].dataset.name)
            {
                matched(openedCardsGlobal);
            } 
            else
            {
                unmatched(openedCardsGlobal);
            }
            openedCardsGlobal = [];
        }
    };


    // when cards match
    //@param openedCard contains the two cards that we just selected
    function matched(openedCards){
       
        openedCards[0].classList.add("match", "disabled");
        openedCards[1].classList.add("match", "disabled");
        openedCards[0].classList.remove("show", "open", "no-event");
        openedCards[1].classList.remove("show", "open", "no-event");
        //openedCardsGlobal = [];
    }


    // when cards don't match
    //@param openedCard contains the two cards that we just selected
    function unmatched(openedCards){
        openedCards[0].classList.add("unmatched");
        openedCards[1].classList.add("unmatched");
     	
        disable();
        setTimeout(function()
        {
        	openedCards[0].style.backgroundSize="0px";
        	openedCards[1].style.backgroundSize="0px";
        	//ie 11 somehow does not support mass class removal so have to split them out one by one
            openedCards[0].classList.remove("show");
            openedCards[0].classList.remove("open");
            openedCards[0].classList.remove("no-event");
            openedCards[0].classList.remove("unmatched");
            openedCards[0].classList.remove("front");
           	openedCards[1].classList.remove("show");
            openedCards[1].classList.remove("open");
            openedCards[1].classList.remove("no-event");
            openedCards[1].classList.remove("unmatched");
            openedCards[1].classList.remove("front");
           
            enable();
           // openedCardsGlobal = [];
        },1100);
    }


    // disable cards temporarily
    function disable(){
        Array.prototype.filter.call(cards, function(card){
            card.classList.add('disabled');
        });
    }


    // enable cards and disable matched cards
    function enable(){
        let matchedCard=matchedCardState();
        Array.prototype.filter.call(cards, function(card){
            card.classList.remove('disabled');
            //redisable cards that are already matched
            for(var i = 0; i < matchedCard.length; i++){
                matchedCard[i].classList.add("disabled");
            }
        });
    }


    // count player's moves
    function moveCounter()
        {   
            var stars = document.querySelectorAll(".fa-star");
           
           //Use inner html with the class moves as a game state for move counter
            let counter = document.querySelector(".moves");
            var moves=counter.innerHTML;
            moves++;
            counter.innerHTML = moves;

            //start timer on first click
            if(moves == 1){
                second = 0;
                minute = 0; 
                hour = 0;
                startTimer();
            }
            // setting rates based on moves
            if (moves > 8 && moves < 12){
                for( i= 0; i < 3; i++){
                    if(i > 1){
                        stars[i].style.visibility = "collapse";
                    }
                }
            }
            else if (moves > 13)
            {
                for( i= 0; i < 3; i++){
                    if(i > 0){
                        stars[i].style.visibility = "collapse";
                    }
                }
            }
          return moves;  
        }



    function startTimer(){
        interval = setInterval(function(){
            timer.innerHTML = minute+"mins "+second+"secs";
            second++;
            if(second == 60){
                minute++;
                second=0;
            }
            if(minute == 60){
                hour++;
                minute = 0;
            }
        },1000);
    }


    // congratulations when all cards match, show modal and moves, time and rating
    function congratulations(){
        let matchedCard=matchedCardState();
        if (matchedCard.length == cardsArray.length){
            clearInterval(interval);
            let finalTime = timer.innerHTML;
             // declare modal
            var modal = document.getElementById("popup1")
            // show congratulations modal
            modal.classList.add("show");

            // declare star rating variable
            let starRating = document.querySelector(".stars").innerHTML;

            //showing move, rating, time on modal
            document.getElementById("finalMove").innerHTML = document.querySelector(".moves").innerHTML;
            document.getElementById("starRating").innerHTML = starRating;
            document.getElementById("totalTime").innerHTML = finalTime;

            //closeicon on modal
            closeModal(modal);
        };
    }


    // close icon on modal
    function closeModal(modal){
        // close icon in modal
        let closeicon = document.querySelector(".close");
        closeicon.addEventListener("click", function(e)
        {
          modal.classList.remove("show");
          startGame();
        });
    }


    // @desciption for user to play Again 
    function playAgain(){

         // declare modal
        let modal = document.getElementById("popup1")
        modal.classList.remove("show");
        startGame();
    }


    function addNeccessaryEventListeners(cardsHtmlElement)
    {

        // loop to add event listeners to each card
        for (var i = 0; i < cardsHtmlElement.length; i++){
            
            cardsHtmlElement[i].addEventListener("click", displayCard);
            cardsHtmlElement[i].addEventListener("click", cardOpen);
            cardsHtmlElement[i].addEventListener("click",congratulations);
        };

        return cardsHtmlElement;
    }

  

})();    