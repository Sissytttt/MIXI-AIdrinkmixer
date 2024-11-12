"use client";

import React from 'react';
import { useState, useEffect } from 'react';

import './styles.css';


const useSpeechRecognition = () => {
    const [text, setText] = useState(""); // Holds the current displayed text
    const [recipe, setRecipe] = useState(""); // Holds the current displayed text
    const [isListening, setIsListening] = useState(false);
    var _result = ""

    useEffect(() => {
        // Check for SpeechRecognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("SpeechRecognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;  // Enables real-time updates
        recognition.continuous = true;      // Keeps recognition running

        const handleResult = (event) => {
            setText(event.results[0][0].transcript); // Update text with interim results
            _result = event.results[0][0].transcript
            console.log(text)
        };

        // Restart recognition automatically if it ends unexpectedly
        recognition.onend = () => {
            setIsListening(false);
            console.log("text: ", _result)
            console.log("1: ", encodeURIComponent(_result))

            fetch('http://127.0.0.1:5000/send_message_to_agent?message=' + encodeURIComponent(_result))
                .then(response => response.json())
                .then(data => {
                    console.log("d: ", data);
                    var _data = "";
                    console.log("d1: ", data.msg["ingredients"]);
                    (data.msg["ingredients"]).map(d => { _data += Object.keys(d)[0] + d[Object.keys(d)[0]] })
                    setRecipe(_data)
                });
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        // Start and stop recognition based on listening state
        if (isListening) {
            recognition.start();
            recognition.onresult = handleResult;
        } else {
            recognition.stop();
        }

        // Cleanup on component unmount
        return () => recognition.stop();
    }, [isListening, recipe]);

    return { recipe, text, isListening, setIsListening };
};

const Translator = () => {
    const { recipe, text, isListening, setIsListening } = useSpeechRecognition();

    const buttonClass = isListening ? "button active" : "button";

    const buttonText = isListening ? "Stop Listening" : "Start Listening";

    return (
        <div className={`translator-container ${isListening ? 'listening' : ''}`}>
            <button
                className={buttonClass}
                onClick={() => { setIsListening(!isListening) }}
            >
                {buttonText}
            </button>
            <div className="text-container">
                <h3 className="recognized-text-title">Recognized Text:</h3>
                <p className="recognized-text">{text}</p>
                <p className="recipe-text">{recipe}</p>
            </div>
        </div>
    );
};


export default Translator;


















