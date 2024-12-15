let isListening = true;
let isRecognitionActive = false;
const recognizedTextDisplay = document.getElementById('recognizedText');
let interimTranscript = "";
let recognition;
let allSpeech = [];
let allTranscript = ""

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        interimTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
        if (recognizedTextDisplay) {
            recognizedTextDisplay.textContent = interimTranscript;
        }
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
            allSpeech.push(...interimTranscript.trim().split(" "));

            fetch(`http://127.0.0.1:5000/send_message_to_agent?message=${encodeURIComponent(interimTranscript)}`)
                .then(response => response.json())
                .then(data => {
                    // console.log("Response data:", data["Overall_Polar_coordinate"]["Polar_angle"], data["Overall_Polar_coordinate"]["Percentage"]);
                    total_PARTICLE_NUMBER += 50;
                    emotion_at(data["Overall_Polar_coordinate"]["Polar_angle"], data["Overall_Polar_coordinate"]["Percentage"]);
                })
        }

        interimTranscript = "";
    }
}

function finalAnalyze() {
    if (recognition && isRecognitionActive) {
        recognition.stop();
        isRecognitionActive = false;
        if (interimTranscript.trim() !== "") {
            allSpeech.push(...interimTranscript.trim().split(" "));
        }
    }
    if (allSpeech.length > 0) {
        allTranscript = `FINAL ALL SPEECH ${allSpeech.join(" ")}`;
        console.log("FINAL ALL SPEECH", allTranscript);
    }

    if (allTranscript.trim() !== "") {
        fetch(`http://127.0.0.1:5000/send_message_to_agent?message=${encodeURIComponent(allTranscript)}`)
            .then(response => response.json())
            .then(data => {
                console.log("FINAL RECIPE:", data["Recipe"]);
            })
            .catch(error => console.error("Error fetching response:", error));
    }
    interimTranscript = "";

}



setInterval(() => {
    stopRecognitionAndSend();
    console.log("Stopped recognition and send data");
    setTimeout(startRecognition, 100);
}, 7000);


setInterval(() => {
    finalAnalyze();
    console.log("THIS IS FINAL ANALYZE");
}, 30000);