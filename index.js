document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);

let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 }, // 1080p
        height: { ideal: 1080 }, // 1080p
        frameRate: { ideal: 30 } // 30 fps
      }
    });
  } catch (err) {
    console.error("Error: " + err);
    return;
  }

  mediaRecorder = new MediaRecorder(captureStream, { mimeType: 'video/webm' });
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.start();

  document.getElementById('controls').style.display = 'none';  // Hide controls during recording
  document.getElementById('stopBtn').disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  document.getElementById('controls').style.display = 'block';  // Show controls after recording
  document.getElementById('stopBtn').disabled = true;
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

function handleStop() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.style.display = 'block';

  const screenVideo = document.getElementById('screenVideo');
  screenVideo.src = url;
  screenVideo.style.display = 'block';
  recordedChunks = [];
}
