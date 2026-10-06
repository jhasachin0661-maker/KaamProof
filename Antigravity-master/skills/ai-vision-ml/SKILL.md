---
name: ai-vision-ml
description: Build computer vision, OCR, speech, classification, prediction, and recommendation systems with PyTorch, TensorFlow, YOLO, Hugging Face; cover dataset hygiene, train/val/test split, metrics, inference serving, and reproducibility. Trigger whenever building ML models, image detection, text recognition, audio processing, or prediction pipelines, even if vision/ML is not explicitly named.
metadata:
  category: ai
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: core-research
  risk_max: MEDIUM
---

# AI Vision ML

## Purpose
Build machine learning applications spanning computer vision (object detection, classification, segmentation), OCR, speech processing, tabular prediction, and recommendation systems. Cover dataset preparation, model selection, training, evaluation metrics, inference serving, and experiment reproducibility using PyTorch, TensorFlow, YOLO, and Hugging Face. Framework details live in references.

## When NOT to use
- Do not use for LLM prompt engineering or text generation (use `ai-llm-integration`).
- Do not use for RAG retrieval pipelines (use `ai-rag-search`).
- Do not use for data pipeline ETL without ML model training (use `data-pipelines-analytics`).

## Inputs
- Dataset files, model configuration, training parameters, `.agent/context/project-context.json`.

## Procedure
1. **Dataset Preparation**: Inspect data quality, handle class imbalance, and split into train/val/test sets (typical 80/10/10). Verify no data leakage between splits. Document dataset provenance and license.
2. **Model Selection**: Choose architecture based on the task per framework references (`references/yolo-detection.md`, `references/pytorch-tf.md`, `references/huggingface.md`). Start with pretrained models and fine-tune.
3. **Training**: Configure hyperparameters, loss functions, and optimizers. Use early stopping on validation loss. Log metrics per epoch with a reproducible random seed.
4. **Evaluation**: Compute task-appropriate metrics per `references/evaluation-metrics.md`. Report confidence intervals or variance across runs.
5. **OCR/Speech**: Integrate OCR engines (Tesseract, EasyOCR, PaddleOCR) per `references/ocr.md` or speech models (Whisper, wav2vec2) per `references/speech.md`.
6. **Serving**: Deploy trained models via REST API (FastAPI, TorchServe, TF Serving) per `references/serving.md`. Include health checks, input validation, and batch inference support.

## Validation
- Training script completes without errors; cite the final command and exit code.
- Evaluation metrics (accuracy, mAP, F1, WER) reported with evidence on the test set.
- Model artifacts saved and loadable (verify with a test inference call).

## Failure handling
- On training divergence (loss NaN or exploding), reduce learning rate, check data normalization, and inspect for corrupt samples. Max 2 remediation cycles.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local training, evaluation, and inference testing.
- `MEDIUM`: Adding ML framework dependencies, downloading large pretrained models, modifying training data pipelines.

## Output
- Handoff file in `.agent/context/handoffs/NN-ai-vision-ml.md` per `references/output-contract.md`.
- Trained model artifacts, evaluation reports, and serving configuration.

## References index
- `references/yolo-detection.md`: YOLO object detection setup and training.
- `references/ocr.md`: OCR engine integration (Tesseract, EasyOCR, PaddleOCR).
- `references/speech.md`: Speech recognition and audio processing.
- `references/pytorch-tf.md`: PyTorch and TensorFlow training patterns.
- `references/huggingface.md`: Hugging Face Transformers and model hub.
- `references/evaluation-metrics.md`: ML evaluation metrics by task type.
- `references/serving.md`: Model serving and inference deployment.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
