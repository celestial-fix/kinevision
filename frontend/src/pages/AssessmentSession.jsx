import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, ChevronRight, CheckCircle, AlertCircle, Video, StopCircle } from 'lucide-react';
import AssessmentLayout from '../components/AssessmentLayout';

const EXERCISES = [
    {
        id: 'squat',
        title: 'Sentadilla Profunda',
        description: 'Párate con los pies al ancho de los hombros. Baja las caderas lo más profundo posible manteniendo el pecho erguido.',
        duration: '5 repeticiones'
    },
    {
        id: 'side_reach',
        title: 'Alcance Lateral',
        description: 'Párate derecho. Levanta un brazo sobre la cabeza e inclínate hacia el lado opuesto. Repite en ambos lados.',
        duration: '3 repeticiones por lado'
    }
];

const AssessmentSession = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [mediaStream, setMediaStream] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const currentExercise = EXERCISES[currentStep];
    const isLastExercise = currentStep === EXERCISES.length - 1;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                handleUpload(blob, 'recording.webm');

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("No se pudo acceder a la cámara. Por favor verifica los permisos o intenta subir un video.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file, file.name);
        }
    };

    const handleUpload = async (fileBlob, filename) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', fileBlob, filename);

        try {
            const response = await fetch(`http://localhost:8000/api/assessment/${sessionId}/submit?exercise_id=${currentExercise.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            // Move to next step or finish
            if (isLastExercise) {
                navigate(`/assessment/results/${sessionId}`);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } catch (err) {
            setError('Falló la subida del video. Por favor intenta nuevamente.');
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    return (
        <AssessmentLayout>
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Ejercicio {currentStep + 1} de {EXERCISES.length}</span>
                        <span>{Math.round(((currentStep) / EXERCISES.length) * 100)}% Completado</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${((currentStep) / EXERCISES.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{currentExercise.title}</h2>
                                <p className="text-slate-400 text-lg">{currentExercise.description}</p>
                            </div>
                            <div className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium">
                                {currentExercise.duration}
                            </div>
                        </div>

                        {/* Video Area */}
                        <div className="aspect-video bg-black/40 rounded-2xl flex items-center justify-center mb-8 border border-white/5 overflow-hidden relative">
                            {isRecording || mediaStream ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            ) : (
                                <div className="text-center p-6">
                                    <Camera className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400">
                                        Grábate realizando el ejercicio.<br />
                                        Asegúrate de que tu cuerpo completo esté en el cuadro.
                                    </p>
                                </div>
                            )}

                            {isRecording && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/80 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    Grabando...
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Recording Controls */}
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    disabled={uploading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Video className="w-5 h-5" />
                                    Grabar Video
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <StopCircle className="w-5 h-5" />
                                    Detener y Enviar
                                </button>
                            )}

                            {/* Upload Fallback */}
                            <input
                                type="file"
                                accept="video/*"
                                capture="environment"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || isRecording}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analizando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Subir Video
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AssessmentLayout>
    );
};

export default AssessmentSession;
