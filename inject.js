const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', function () {
 (async () => {
  document.body.style.visibility = "hidden"
  await new Promise(r => setTimeout(r, 3000))
  document.body.style.visibility = "visible"

  const canvas = document.querySelector("canvas");
  canvas.style.borderRadius = "0";
  document.body.style.overflow = "hidden";
  canvas.style.height = "100vh";
  document.querySelector(".fullscreen").childNodes[0].childNodes[0].remove()
  document.querySelector(".fullscreen").childNodes[0].childNodes[0].childNodes[0].remove()
  document.querySelector(".fullscreen").childNodes[0].childNodes[0].childNodes[1].remove()
  document.querySelector(".fullscreen").childNodes[0].className = ""
  document.querySelector(".fullscreen").childNodes[0].childNodes[0].className = ""

  const newCanvas = document.createElement("canvas");
  // newCanvas.width = canvas.width;
  // newCanvas.height = canvas.height;
  ipcRenderer.on('ping', () => {
   const newContext = newCanvas.getContext('2d');

   // newContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);

   // Set the dimensions of the vertical canvas
   newCanvas.width = canvas.height;
   newCanvas.height = canvas.width;

   // Translate and rotate the context
   newContext.translate(newCanvas.width / 2, newCanvas.height / 2);
   newContext.rotate(Math.PI / 2);
   newContext.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

   const dataURL = newCanvas.toDataURL('image/png')
   // const recording_url = URL.createObjectURL(blob);
   const recording_url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
   // Attach the object URL to an <a> element, setting the download file name
   const a = document.createElement('a');
   a.style = "display: none;";
   a.href = recording_url;
   a.download = new Date().toISOString() + ".webp";
   document.body.appendChild(a);
   // Trigger the file download
   a.click();
  })
  // ipcRenderer.on('ping', () => {
  //  ipcRenderer.sendToHost("recording");
  //  var chunks = [];
  //  var canvas_stream = canvas.captureStream(30); // fps
  //  // Create media recorder from canvas stream
  //  this.media_recorder = new MediaRecorder(canvas_stream, { mimeType: "video/webm; codecs=vp9" });
  //  // Record data in chunks array when data is available
  //  this.media_recorder.ondataavailable = (evt) => { chunks.push(evt.data); };
  //  // Provide recorded data when recording stops
  //  this.media_recorder.onstop = () => { this.on_media_recorder_stop(chunks); }
  //  // Start recording using a 1s timeslice [ie data is made available every 1s)
  //  this.media_recorder.start(1000);

  //  setTimeout(() => {
  //   this.media_recorder.stop();

  //   // Gather chunks of video data into a blob and create an object URL
  //   var blob = new Blob(chunks, { type: "video/webm" });

  //   const recording_url = URL.createObjectURL(blob);
  //   // Attach the object URL to an <a> element, setting the download file name
  //   const a = document.createElement('a');
  //   a.style = "display: none;";
  //   a.href = recording_url;
  //   a.download = new Date().toISOString() + ".webm";
  //   document.body.appendChild(a);
  //   // Trigger the file download
  //   a.click();

  //   ipcRenderer.sendToHost("complete");

  //   setTimeout(() => {
  //    URL.revokeObjectURL(recording_url);
  //    document.body.removeChild(a);
  //   }, 0);
  //  }, 5000)
  // })
 })()
}, false);

