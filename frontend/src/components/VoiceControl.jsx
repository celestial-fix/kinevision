import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceControl = ({ onCommand }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognitionInstance = new window.webkitSpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'es-ES'; // Spanish

            recognitionInstance.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                const text = lastResult[0].transcript.trim().toLowerCase();
                setTranscript(text);
                onCommand(text);

                // Clear transcript after a delay
                setTimeout(() => setTranscript(''), 3000);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                // Auto-restart if it was supposed to be listening
                if (isListening) {
                    recognitionInstance.start();
                }
            };

            setRecognition(recognitionInstance);
        } else {
            console.warn("Web Speech API not supported in this browser.");
        }
    }, [onCommand]);

    const toggleListening = () => {
        if (recognition) {
            if (isListening) {
                recognition.stop();
                setIsListening(false);
            } else {
                recognition.start();
                setIsListening(true);
            }
        }
    };

    if (!recognition) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {transcript && (
                <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm animate-fade-in">
                    "{transcript}"
                </div>
            )}
            <button
                onClick={toggleListening}
                className={`p-4 rounded-full shadow-lg transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
                {isListening ? <Mic className="text-white" /> : <MicOff className="text-slate-400" />}
            </button>
        </div>
    );
};

export default VoiceControl;
