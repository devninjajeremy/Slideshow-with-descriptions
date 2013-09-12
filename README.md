Slideshow-with-descriptions
===========================

This is a slideshow with descriptions developed with jQuery and some CSS3 animations.

DEMO: http://goo.gl/CFjRE1

About it
===========================

The images slide every 7 seconds and a red-bar shows the progressions of the transitions.
The users can click the pause button to stop the transition and restart it by the play-button when the current transition is finished.

The slideshow can be edited by the config.js file.

`````javascript
/* config.js */
 
var transitionSpeed = 7000;
var detailsSpeed = 800;
var delayImageOpacityTransition = 1000;
var imageOpacitySpeed = 500;
var secondColor = '#d83e26';
`````

- transitionSpeed: time of the transition;
- detailsSpeed: details fade in/out in this time
- delayImageOpacityTransition: delay before the old image become transparent
- imageOpacitySpeed: time that the image take to become transparent
- secondColor: second color (progressive-bar, buttons etc..) 



External plugin
===========================

- Images are responsive, thanks to response.js: http://responsejs.com/

- The preloader used is spin.js : http://fgnass.github.io/spin.js/

Version 0.1
===========================
This is the first version, if you have any suggestions or ideas just open an issue.
