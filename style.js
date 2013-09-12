// vars
var total_images; // total numeber of images
var item_visible_no = 0; // current item >> the first one
var going_to_no = 1; // next or previous image
var descr_height; // height of the container
var limit; // number of total images
var damn_user_selection = -1; 
var stop_loop = false; // to be deleted
var stop_loop_on;
var loop_stopped = false;
var stop_next_loop = 0;
var selection = false;
var current_tag = 'pause';

$(document).ready(function()
{	
	
	// init var total_images
	total_images = $('.big_image').length;

	$('.cnt_descr_box').each(function(){

		diff = ($(this).parent().height() - $(this).height())/2;
		if (diff > 0 ) $(this).css( 'top', diff );

	});

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

	// Assign variable
	limit = $('.big_image').length;
    descr_height = $('#descr_box').height();

    // The first image is at the top!
    $('.big_image').eq(0).css('zIndex',99);
    $('.cnt_descr_box').eq(0).toggleClass('visible');

    $('#descr_box').css('top',$('#descr_box').height());

    // Loading mask till images load
	$('#images_list').waitForImages({
	    finished: function() {
	        
	        $('#mask').delay(200).fadeOut("slow");
		    // All descendant images have loaded, now slide up.
		    $('#descr_box').stop().delay(1500).animate({'top':'0'},{duration:700,specialEasing:"easeInCubic"});

		    ready_run_slideshow();

	    },
	    each: function() {
	       // ...
	    },
	    waitForAll: true
	});

	$('#bigthumb').mouseenter(function(){ __log_show() });
	$('#bigthumb').mouseleave(function(){ __log_hide() });

	
});
	
	
	function ready_run_slideshow(){

		init_status_bar(0);

		run_progressive_bar(6500);
		setTimeout('infinite_loop()',7000);

		// click on a single element
		$('#status-slideshow .single-elem').click(function(){

			selection = true;
			// go to the selected image
			var selected = $(this).attr('class').slice(15);
			damn_user_selection = parseInt(selected);

			// stop loop
			stop_next_loop = 1;
			stop_loop_on = damn_user_selection;

			//replace buttons
			console.log( 'current tag :' + current_tag );
			if (current_tag == 'pause') { __log_tag('move'); }

			__log_show();

			if (loop_stopped){ 

				// reset vars
				stop_loop = false;
				__log_tag('pause');
				if (loop_stopped) { infinite_loop() }
				loop_stopped = false;
				selection = false;


			}

		});

		// click on pause button		
		$('.log .pause').click(function(){
			pause_animation();
			stop_loop = true;
			__log_tag('wait');			

		});

		// click on play button
		$('.log .play').click(function(e){
			// reset vars
			stop_loop = false;
			__log_tag('pause');
			if (loop_stopped) { infinite_loop() }
			loop_stopped = false;

		});

	}


	function init_status_bar(active){
		// Create the status bar
		for(y = 0; y < $('.big_image').length; y++){
			$('#status-slideshow').append(' <li class="single-elem no-'+y+'"></li>  ');
		}
		// The active one has to be highlighted
		$('#status-slideshow .single-elem').eq(active).toggleClass('active');
	}


	// Slide image 
	function slide(item_visible_no,going_to_no){

		// console.log('slide >> visible: '+item_visible_no+' || going_to '+going_to_no);
		console.log('-------------------------------');

		// Set chosen image under the visible one
		$('#images_list img').eq(going_to_no).css('zIndex','98');
		console.log('zIndex');

		// Description moves down
		$('#descr_box').stop().animate({'top':descr_height},{duration:1500,specialEasing:"linear", complete:function(){changeDescr()}});
		console.log('descrBox down');

		// Image fade out
		$('.big_image').eq(item_visible_no).delay(1000).animate({'opacity':'0'},500);
		console.log('big image opacity');

		// Description moves up
		$('#descr_box').delay(500).animate( { 'top': 0 },{duration:1500, specialEasing:"linear", complete:function(){transp(this)}} );
		console.log('descrBox up');

		// Refresh status bar
		refresh_status( going_to_no );
	}


	// This is transparent to the user
	function transp(elem){
		
		$('#images_list img').eq(going_to_no).css('zIndex','99');
		$('#images_list img').eq(item_visible_no).css('zIndex','0');
		$('#images_list img').eq(item_visible_no).css('opacity','1');

		// Refresh var
		item_visible_no = going_to_no;

	}

	// This function change the description when descr_box is invisible
	function changeDescr(){

		// change description element
		$('.cnt_descr_box').removeClass('visible');
		$('.cnt_descr_box').eq(going_to_no).addClass('visible');

	}

	function refresh_status(elem_no){

		var status_single_element = '#status-slideshow .single-elem';

		$(status_single_element).removeClass('active');
		$(status_single_element).eq(elem_no).toggleClass('active');

	}


function infinite_loop()
{
	   console.log("starting loop");
       // set vars
       going_to_no = item_visible_no+1;

       // If current img is the last one -> restart from the first (0)
       if (item_visible_no == limit-1){ going_to_no = 0; }

       // if the user select an image...
       if (damn_user_selection != -1){
       		// set new goal
       		going_to_no = damn_user_selection;
       		//reset damn_user_selection
       		damn_user_selection = -1;
       	}

       // restart loop ( if no item has been selected by users )
       if (!stop_loop &&  stop_next_loop != 2 && item_visible_no != damn_user_selection ) {
       		console.log('controllo eseguito');
       		if (selection) stop_next_loop++; 
       		console.log('selection ->' + selection);
       		console.log('snl ->' + stop_next_loop);
       		// everything okay, restart loop
       		// slide image
       		slide(item_visible_no,going_to_no);
       		// run bar animation
	   		run_progressive_bar(6500);
       	    setTimeout("infinite_loop()",7000);
   	   }else{

   	   		// the loop has been stopped
   	   		// insert play button to restart the loop
   	   		console.log('loop stopped : ');
   	   		console.log(' -- selection ->' + selection);
   	   		console.log(' -- stop_loop ->' + stop_loop);
   	   		console.log(' -- snl ->' + stop_next_loop);
   	   		console.log(' -- i_v_n , d_u_s ->' + item_visible_no +' , ' + damn_user_selection);

   	   		loop_stopped = true;
   	   		__log_tag('play');
   	   		stop_next_loop = 0;
   	   		if (selection) {
   	   			selection = false; 
   	   			stop_next_loop = 0;
   	   		}
   	   }
}

function pause_animation(){

	// pause progress bar
	//$('.status .avanzamento').stop();
	//$('.status .avanzamento').animate({'width':'100%'},{duration:100});

	// stop all animations
	$('*').not('.status .avanzamento').finish();

}
function run_progressive_bar(millis){

	   // start animation progressive bar
       $('.status .avanzamento').css('width','0px');
       $('.status .avanzamento').animate({'width':'100%'},{duration:millis});
}

// Active or disable log
function __log_show(){
	$('.log').addClass('enabled');
}
function __log_hide(){
	$('.log').removeClass('enabled');
}


// Add 'disabled' to all except to tag
function __log_tag(tag){
	
	$('.log-a').removeClass('disabled');
	$('.log-a').addClass('disabled');
	$('.log-a.'+tag).removeClass('disabled');

	current_tag = tag;
}