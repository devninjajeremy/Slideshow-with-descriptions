
// VARS - DO NOT TOUCH
var totalImages; // total numeber of images
var itemVisibleNo = 0; // current item >> the first one
var goingToNo = 1; // next or previous image
var descrHeight; // height of the container
var limit; // number of total images
var damnUserSelection = -1; 
var stopLoop = false; // to be deleted
var stopLoopOn;
var loopStopped = false;
var stopNextLoop = 0;
var selection = false;
var currentTag = 'pause';

$(document).ready(function()
{	

	// SPIN ICON START ---------------------------------------------->

	// installing the spinner icon
	var opts = {
	  lines: 13, // The number of lines to draw
	  length: 9, // The length of each line
	  width: 4, // The line thickness
	  radius: 19, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 18, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#fff', // #rgb or #rrggbb
	  speed: 1.6, // Rounds per second
	  trail: 66, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: 'auto', // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};

	var target = document.getElementById('mask');
	var spinner = new Spinner(opts).spin(target);

	// SPIN ICON END ----------------------------------------------->

	// Assign variable
	totalImages = $('.big_image').length;
	limit = $('.big_image').length;
    descrHeight = $('#descr_box').height();

    // The first image is at the top!
    $('.big_image').eq(0).css('zIndex',99);
    $('.cnt_descr_box').eq(0).toggleClass('visible');

    $('#descr_box').css('top',$('#descr_box').height());

   
	        
	$('#mask').delay(200).fadeOut("slow");
	// All descendant images have loaded, now slide up.
	$('#descr_box').stop().delay(1300).animate({'top':'0'},{duration:detailsSpeed,specialEasing:"easeInCubic"});

	readyRunSlideshow();


	$('#bigthumb').mouseenter(function(){ __logShow() });
	$('#bigthumb').mouseleave(function(){ __logHide() });

	
});
	
	
	function readyRunSlideshow(){

		initStatusBar(0);
		runProgressiveBar(transitionSpeed);

		setTimeout('infiniteLoop()',transitionSpeed);

		// click on a single element
		$('#status-slideshow .single-elem').click(function(e){

			e.preventDefault();
			selection = true;
			// go to the selected image
			var selected = $(this).attr('class').slice(15);
			damnUserSelection = parseInt(selected);

			// stop loop
			stopNextLoop = 1;
			stopLoopOn = damnUserSelection;

			//replace buttons
			if (currentTag == 'pause') { __logTag('move'); }

			__logShow();

			if (loopStopped){ 

				// reset vars
				stopLoop = false;
				__logTag('pause');
				if (loopStopped) { infiniteLoop() }
				loopStopped = false;
				selection = false;


			}

		});

		// click on pause button		
		$('.log .pause').click(function(){
			pauseAnimation();
			stopLoop = true;
			__logTag('wait');			

		});

		// click on play button
		$('.log .play').click(function(e){
			// reset vars
			stopLoop = false;
			__logTag('pause');
			if (loopStopped) { infiniteLoop() }
			loopStopped = false;

		});

	}


	function initStatusBar(active){
		// Create the status bar
		for(y = 0; y < $('.big_image').length; y++){
			$('#status-slideshow').append(' <li class="single-elem no-'+y+'"></li>  ');
		}
		// The active one has to be highlighted
		$('#status-slideshow .single-elem').eq(active).toggleClass('active');
	}


	// Slide image 
	function slide(itemVisibleNo,goingToNo){


		// Set chosen image under the visible one
		$('#images_list img').eq(goingToNo).css('zIndex','98');

		// Description moves down
		$('#descr_box').stop().animate({'top':descrHeight},{duration:detailsSpeed,specialEasing:"linear", complete:function(){changeDescr()}});

		// Image fade out
		$('.big_image').eq(itemVisibleNo).delay(delayImageOpacityTransition).animate({'opacity':'0'},imageOpacitySpeed);

		// Description moves up
		$('#descr_box').delay(imageOpacitySpeed).animate( { 'top': 0 },{duration:detailsSpeed, specialEasing:"linear", complete:function(){transp(this)}} );

		// Refresh status bar
		refreshStatus( goingToNo );
	}


	// This is transparent to the user
	function transp(elem){
		
		$('#images_list img').eq(goingToNo).css('zIndex','99');
		$('#images_list img').eq(itemVisibleNo).css('zIndex','0');
		$('#images_list img').eq(itemVisibleNo).css('opacity','1');

		// Refresh var
		itemVisibleNo = goingToNo;

	}

	// This function change the description when descr_box is invisible
	function changeDescr(){

		// change description element
		$('.cnt_descr_box').removeClass('visible');
		$('.cnt_descr_box').eq(goingToNo).addClass('visible');

	}

	function refreshStatus(elem_no){

		var statusSingleElement = '#status-slideshow .single-elem';

		$(statusSingleElement).removeClass('active');
		$(statusSingleElement).eq(elem_no).toggleClass('active');

	}


function infiniteLoop()
{
       // set vars
       goingToNo = itemVisibleNo+1;

       // If current img is the last one -> restart from the first (0)
       if (itemVisibleNo == limit-1){ goingToNo = 0; }

       // if the user select an image...
       if (damnUserSelection != -1){
       		// set new goal
       		goingToNo = damnUserSelection;
       		//reset damnUserSelection
       		damnUserSelection = -1;
       	}

       // restart loop ( if no item has been selected by users )
       if (!stopLoop &&  stopNextLoop != 2 && itemVisibleNo != damnUserSelection ) {
       		
       		if (selection) stopNextLoop++; 
       		// everything okay, restart loop
       		// slide image
       		slide(itemVisibleNo,goingToNo);
       		// run bar animation
	   		runProgressiveBar(transitionSpeed);
       	    setTimeout("infiniteLoop()",transitionSpeed);

   	   }else{

   	   		// the loop has been stopped
   	   		loopStopped = true;
   	   		__logTag('play');
   	   		stopNextLoop = 0;
   	   		if (selection) {
   	   			selection = false; 
   	   			stopNextLoop = 0;
   	   		}
   	   }
}

function pauseAnimation(){

	// stop all animations
	$('*').not('.status .avanzamento').finish();

}
function runProgressiveBar(millis){

	   // start animation progressive bar
       $('.status .avanzamento').css('width','0px');
       $('.status .avanzamento').animate({'width':'100%'},{duration: millis-50});
}

// Active or disable log
function __logShow(){
	$('.log').addClass('enabled');
}
function __logHide(){
	$('.log').removeClass('enabled');
}


// Add 'disabled' to all except to tag
function __logTag(tag){
	
	$('.log-a').removeClass('disabled');
	$('.log-a').addClass('disabled');
	$('.log-a.'+tag).removeClass('disabled');

	currentTag = tag;
}