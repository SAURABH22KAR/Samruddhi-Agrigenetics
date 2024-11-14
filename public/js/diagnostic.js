// Elements
const cameraStream = document.getElementById('camera-stream');
const aiAnimationOverlay = document.getElementById('ai-animation-overlay'); // Overlay for AI animation
const cameraCanvas = document.getElementById('camera-canvas');
const openCameraBtn = document.getElementById('open-camera');
const captureButton = document.getElementById('capture-button');
const analyzeButton = document.getElementById('analyze-button');
const uploadInput = document.getElementById('upload-image');

let stream;

openCameraBtn.addEventListener('click', async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
            cameraStream.srcObject = stream;
            cameraStream.style.display = 'block';
            aiAnimationOverlay.style.display = 'block';  // Show animation overlay
            captureButton.style.display = 'block';
        } catch (err) {
            console.error('Error accessing the camera: ', err);
            aiAnimationOverlay.style.display = 'none';  // Hide overlay if camera access fails
        }
    } else {
        alert('Camera not supported');
    }
});

// Capture image from the camera
captureButton.addEventListener('click', () => {
    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraStream.videoWidth;
    cameraCanvas.height = cameraStream.videoHeight;
    context.drawImage(cameraStream, 0, 0);
    const imageData = cameraCanvas.toDataURL('image/png');
    analyzeImage(imageData);

    // Stop the camera stream after capturing
    stopCamera();
});

window.addEventListener('beforeunload', () => {
    stopCamera();
});

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        cameraStream.style.display = 'none';
        captureButton.style.display = 'none';
        aiAnimationOverlay.style.display = 'none'; // Hide animation overlay when camera stops
    }
}

// Analyze image from camera or upload
function analyzeImage(imageData) {
    fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('disease').textContent = `Disease: ${data.disease}`;
        document.getElementById('recommendation').textContent = `Recommendation: ${data.recommendation}`;
    })
    .catch(err => console.error('Error analyzing image: ', err));
}

uploadInput.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageData = event.target.result;
        analyzeImage(imageData);
    };
    reader.readAsDataURL(e.target.files[0]);
});
