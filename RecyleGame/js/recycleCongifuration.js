//Initialize configurable items that will appear on screen
function populateConfiguredRecyleInfo()
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
        'binName':'metal',
        'img':'img/metal.png'
      },

    ];
    return recycleBinsInfo;

}


function populateConfiguredItems()
{
      const recyclableItemsInfo=
    [
      {
        'itemType':'paper',
        'itemName':'roughPaper',
        'img':'img/paper.png'
      },
      {
        'itemType':'glass',
        'itemName':'beerBottle',
        'img':'img/glass.png'
      },
      {
        'itemType':'plastic',
        'itemName':'petBottle',
        'img':'img/plastic.png'
      },
      {
        'itemType':'metal',
        'itemName':'metalCans',
        'img':'img/metal.png'
      },

    ];
    return recyclableItemsInfo;
}


//End of configurable items that will appear on screen

//Stat of dynamically build up html elements and game rules


//generic function to take in configurable arrays and out an arrays of html elements
//@params:
//arrayInfo:configurable arrays
//htmlType: type of html elements, egs(img, div or etc)
function buildHTMLElement(arrayInfo, htmlType)
{
         var htmlArrayBuilder=[];
          for(var i = 0; i < arrayInfo.length; i++){
          // Create a html elements according to the passed in parameters
            const htmlElement = document.createElement(htmlType);
            htmlArrayBuilder.push(htmlElement);
        }
        //);
          return htmlArrayBuilder;
}



//Initialize recycle bin display
function initializeRecycleBin()
{
	      let recycleBinArea = document.getElementById("recycleBinArea");
        let recycleBinsInfo=populateConfiguredRecyleInfo();
        recycleBinsInfo = shuffle(recycleBinsInfo);
       
        let recycleBinsHTMLArrays=buildHTMLElement(recycleBinsInfo,'div');
        populateAddDropInteraction(recycleBinsInfo);
      
        for (let i = 0; i < recycleBinsHTMLArrays.length; i++)
        {
            recycleBinsHTMLArrays[i].classList.add("dropzone");
            recycleBinsHTMLArrays[i].classList.add(recycleBinsInfo[i].binName+"dropArea");
            recycleBinsHTMLArrays[i].name = recycleBinsInfo[i].binName;
            recycleBinsHTMLArrays[i].style.backgroundImage = 'url('+recycleBinsInfo[i].img+')';
            recycleBinArea.appendChild(recycleBinsHTMLArrays[i]);
		}

}
//load function to dynmatically create recycle bins elements
document.body.onload=initializeRecycleBin();


//Initialize recycle items display
function initializeRecyclableItems()
{
        let recycleItems = document.getElementById("itemsArea");
        let recycleItemsInfo=populateConfiguredItems();
        recycleItemsInfo = shuffle(recycleItemsInfo);
       
        let recycleItemsHTMLArrays=buildHTMLElement(recycleItemsInfo,"img");
        
      
        for (let i = 0; i < recycleItemsHTMLArrays.length; i++)
        {
            recycleItemsHTMLArrays[i].classList.add("draggable");
            recycleItemsHTMLArrays[i].classList.add("drag-drop");
            recycleItemsHTMLArrays[i].classList.add("items");
            recycleItemsHTMLArrays[i].classList.add(recycleItemsInfo[i].itemType+"Item");
            recycleItemsHTMLArrays[i].name = recycleItemsInfo[i].itemName;
            recycleItemsHTMLArrays[i].src=recycleItemsInfo[i].img;
            recycleItems.appendChild(recycleItemsHTMLArrays[i]);
    }

}
//load function to dynmatically create recycle items elements
document.body.onload=initializeRecyclableItems();


//knuth  shuffling of arrays.
//@params
//array:takes in type array
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

//End of dynamically build up html elements and game rules



//Drag and Drop functionalities


function dynamicallyAddDropInteraction(dropArea,dropItem)
{
  interact(dropArea).dropzone({
    // only accept elements matching this CSS selector
      accept: '.items',
     
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:

    ondropactivate: function (event) {
      // add active dropzone feedback
     // event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
       dropzoneElement = event.target;

      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
      draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target');

      event.relatedTarget.classList.remove('can-drop');
      event.relatedTarget.textContent = 'Dragged out';


    },
    ondrop: function (event) {
      event.relatedTarget.textContent = 'Dropped';
      console.log(dropItem+event.relatedTarget.classList+event.relatedTarget.classList.contains(dropItem));
      if(event.relatedTarget.classList.contains(dropItem))
      {
       event.relatedTarget.parentNode.removeChild(event.relatedTarget);
      }
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });
} 

  function populateAddDropInteraction(arrayInfo)
  { 
    for(var i=0; i<arrayInfo.length;i++)
    {
      dynamicallyAddDropInteraction('.'+arrayInfo[i].binName+'dropArea',arrayInfo[i].binName+'Item');
    }
    
  }


// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "#fullGameArea",
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

$( document ).ready(function() {
    $( '.items' ).each(function() {

       /* $holder    = $(this).parent();
        $divWidth  = 100;
        $divHeight =100;
       */
       maxLeft=80;
       minLeft=1;
       maxTop=80;
       minTop=30;

        
           $(this).css({
               /* 'left': Math.floor( Math.random() * Number( $divWidth ) )+'%',
                'top' : Math.floor( Math.random() * Number( $divHeight ) )+'%'
                */
               'left': Math.floor(Math.random() * (maxLeft - minLeft) + minLeft)+'%',
                'top': Math.floor(Math.random() * (maxTop - minTop) + minTop)+'%'
           });        

    })
});