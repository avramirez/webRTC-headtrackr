$(document).ready(function(){
	var videoInput = document.getElementById('inputVideo');
  	var canvasInput = document.getElementById('inputCanvas');

  	var htracker = new headtrackr.Tracker({calcAngles : true,detection:"VJ"});
  	htracker.init(videoInput, canvasInput);
  	htracker.start();

  	var overlay = $("#overlay")[0];
  	var overlayContext = overlay.getContext('2d');

  	var imageObj = new Image();
  	 // $("#mask1").hide();



      imageObj.src = 'assets/images/mask1.png';

  	document.addEventListener('facetrackingEvent', 
	  function (event) {
	   	$("#xhead").val(event.x);
	   	$("#yhead").val(event.y);
	   	$("#hhead").val(event.height);
	   	$("#whead").val(event.width);
	   	$("#anglehead").val(event.angle);
	   	$("#mask1").css({
	   		"width":event.width,
	   		"top":event.y - (event.height/2),
	   		"left":event.x -(event.width/2)
	   	})

	   	// $("#pointCenter").css({
	   	// 	"top":event.y,
	   	// 	"left":event.x
	   	// })

  		overlayContext.clearRect(0,0,320,240);
  		overlayContext.translate(event.x, event.y)
		overlayContext.rotate(event.angle-(Math.PI/2));
		overlayContext.strokeStyle = "#00CC00";
		
		// overlayContext.drawImage(imageObj,(-(event.width/2)) >> 0,(-(event.height/2)) >> 0,event.width,imageObj.height*((imageObj.width - event.width)/imageObj.width));
		overlayContext.drawImage(imageObj,(-(event.width/2)) >> 0,(-(event.height/2)) >> 0,event.width,$("#mask1").height());
		overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
		overlayContext.rotate((Math.PI/2)-event.angle);
		overlayContext.translate(-event.x, -event.y);

	  }
	);
});