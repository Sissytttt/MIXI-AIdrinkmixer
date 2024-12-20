let isListening = false;
const toggleListeningButton = document.getElementById('toggleListening');
const recognizedTextDisplay = document.getElementById('recognizedText');
const recipeDetailsDisplay = document.getElementById('recipeDetails');

toggleListeningButton.addEventListener('click', () => {
    isListening = !isListening;
    toggleListeningButton.textContent = isListening ? "Stop Listening" : "Start Listening";

    if (isListening) {
        startRecognition();
    } else {
        stopRecognition();
    }
});

let recognition;
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        // const transcript = event.results[0][0].transcript;
        // recognizedTextDisplay.textContent = transcript;

        if (!isListening) {
            fetch(`http://127.0.0.1:5000/send_message_to_agent?message=${encodeURIComponent(event.results[0][0].transcript)}`)
                .then(response => response.json())
                .then(data => {
                    // console.log("data: ", data["msg"][0].Polar_angle, data["msg"][1].Percentage)
                    // console.log("data[0].Polar_angle, data[1].Percentage: ", data["msg"][0].Polar_angle, data["msg"][1].Percentage)
                    total_PARTICLE_NUMBER += 50;
                    emotion_at(data["msg"][0].Polar_angle, data["msg"][1].Percentage)
                })
                // .catch(error => console.error("Error fetching recipe:", error));
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        isListening = false;
        toggleListeningButton.textContent = "Start Listening";
    };
} else {
    console.error("SpeechRecognition API not supported in this browser.");
}

function startRecognition() {
    if (recognition) recognition.start();
}

function stopRecognition() {
    if (recognition) recognition.stop();
}