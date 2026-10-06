# Speech Processing

## Speech-to-Text (ASR)
### OpenAI Whisper
```python
import whisper
model = whisper.load_model("base")  # tiny, base, small, medium, large
result = model.transcribe("audio.mp3")
print(result["text"])
```
- Use `large-v3` for best accuracy; `tiny` or `base` for speed.
- Supports 99 languages with automatic language detection.

### Hugging Face wav2vec2
```python
from transformers import pipeline
asr = pipeline("automatic-speech-recognition", model="facebook/wav2vec2-base-960h")
result = asr("audio.wav")
```

## Text-to-Speech (TTS)
- **OpenAI TTS**: `client.audio.speech.create(model="tts-1", voice="alloy", input="Hello")`
- **Coqui TTS**: Open-source, supports voice cloning.
- **pyttsx3**: Offline, uses system speech engine.

## Audio Preprocessing
- Resample to 16kHz mono (Whisper and wav2vec2 expect this).
- Use `pydub` or `librosa` for format conversion and normalization.
- Split long audio into segments (30s-1min) for better transcription accuracy.

## Evaluation Metrics
- **WER (Word Error Rate)**: Primary ASR metric. Lower is better.
- **CER (Character Error Rate)**: Useful for languages without clear word boundaries.
- Compare against ground-truth transcriptions for evaluation.
