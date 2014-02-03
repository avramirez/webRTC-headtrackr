$(document).ready(function(){
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

  var vgaConstraints = {
      video: {
        mandatory: {
          maxWidth: 640,
          maxHeight: 360
        }
      }
    };
  var video = document.querySelector('video');
  var timeOut, lastImageData;
  var canvasSource = $("#canvas-source")[0];
  var canvasBlended = $("#canvas-blended")[0];
  var contextSource = canvasSource.getContext('2d');
  var contextBlended = canvasBlended.getContext('2d');
  var img = $("#captured")[0];
  var start=0;

  // contextSource.translate(canvasSource.width, 0);
  // contextSource.scale(-1, 1);
  // video.msHorizontalMirror = true;
  // videoWidtheo.scale(-1, 1);
  function sizeCanvas() {
    setTimeout(function() {
      contextSource.width = video.videoWidth;
      contextSource.height = video.videoHeight;
      contextBlended.width = video.videoWidth;
      contextBlended.height = video.videoHeight;
      img.height = video.videoHeight;
      img.width = video.videoWidth;
    }, 100);
  }

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0);
     $("#captured").src = canvas.toDataURL('image/webp');
    }
  }


  function update() {
    drawVideo();
    blend();
    checkAreas();
    timeOut = setTimeout(update, 1000/60);
  }

  function drawVideo() {
    contextSource.drawImage(video, 0, 0);
  }

  function fastAbs(value) {
  // equivalent to Math.abs();
    return (value ^ (value >> 31)) - (value >> 31);
  }


  function threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
  }

  function differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
      var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
      var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
      var diff = threshold(fastAbs(average1 - average2));
      target[4*i] = diff;
      target[4*i+1] = diff;
      target[4*i+2] = diff;
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  function blend() {
    var width = canvasSource.width;
    var height = canvasSource.height;
    // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height);
    // create an image if the previous image doesn’t exist
    if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height);
    // blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    contextBlended.putImageData(blendedData, 0, 0);
    
    // store the current webcam image
    lastImageData = sourceData;
  }

 
    function checkAreas() {
      
        var blendedData = contextBlended.getImageData(
          80,
          10,
          50,
          50);

        var i = 0;
        var average = 0;
        while (i < (blendedData.data.length / 4)) {
          average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
          ++i;
        }
        average = Math.round(average / (blendedData.data.length / 4));
        if (average > 10) {
          if(start > 0){
            $("#mask1")
            $("#videoContainer img.mainMask").remove();
            $("#videoContainer").prepend("<img class='mainMask' src='"+$("#mask1").attr("src")+"' style='position:absolute;top:0;left:0;z-index=20;'>");
            
            // $('.mainMask').attr("style","position:absolute;top:"+ ($("#canvas-source").height()/2 - $('.mainMask').height()) + "px;left:"+ ($("#canvas-source").width()/2 - $('.mainMask').width()) + "px;z-index=100;");
          }else{
            start++;  
          }
          
      }
      
    }

    
  // video.addEventListener('click', snapshot, false);
 
  update();
  navigator.getUserMedia(vgaConstraints, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
      sizeCanvas();
      button.textContent = 'Take Shot';
    }, errorCallback);


} else {
  alert('getUserMedia() is not supported in your browser');
}

})
