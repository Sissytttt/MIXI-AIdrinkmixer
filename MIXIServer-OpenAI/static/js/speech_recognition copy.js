let isListening = true;
let isRecognitionActive = false;
const recognizedTextDisplay = document.getElementById('recognizedText');
let interimTranscript = "";
let recognition;

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        interimTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
        recognizedTextDisplay.textContent = interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        if (isListening) startRecognition();
    };
} else {
    console.error("SpeechRecognition API not supported in this browser.");
}

function startRecognition() {
    if (recognition && !isRecognitionActive) {
        recognition.start();
        isRecognitionActive = true;
    }
}

function stopRecognitionAndSend() {
    if (recognition && isRecognitionActive) {
        recognition.stop();
        isRecognitionActive = false;

        if (interimTranscript.trim() !== "") {
            fetch(`http://127.0.0.1:5000/send_message_to_agent?message=${encodeURIComponent(interimTranscript)}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Response data:", data["Polar_angle"], data["Percentage"]);
                    total_PARTICLE_NUMBER += 50;
                    emotion_at(data["Polar_angle"], data["Percentage"]);
                })
                .catch(error => console.error("Error fetching response:", error));
        }

        interimTranscript = "";
    }
}

setInterval(() => {
    stopRecognitionAndSend();
    console.log("stop recignition and send");
    setTimeout(startRecognition, 100);
}, 5000);
