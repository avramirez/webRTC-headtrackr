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
  var canvas = document.querySelector('canvas');
  var img = document.querySelector('img');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  function sizeCanvas() {
    setTimeout(function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      img.height = video.videoHeight;
      img.width = video.videoWidth;
    }, 100);
  }

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0);
      document.querySelector('img').src = canvas.toDataURL('image/webp');
    }
  }

  video.addEventListener('click', snapshot, false);

  navigator.getUserMedia(vgaConstraints, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
      sizeCanvas();
      button.textContent = 'Take Shot';
    }, errorCallback);


} else {
  alert('getUserMedia() is not supported in your browser');
}
