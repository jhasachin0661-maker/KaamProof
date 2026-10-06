# ML Evaluation Metrics

## Classification
| Metric | Formula | Use When |
|--------|---------|----------|
| Accuracy | correct / total | Balanced classes |
| Precision | TP / (TP + FP) | False positives are costly |
| Recall | TP / (TP + FN) | False negatives are costly |
| F1 Score | 2 * (P * R) / (P + R) | Imbalanced classes |
| ROC-AUC | Area under ROC curve | Threshold-independent comparison |

## Object Detection
| Metric | Description |
|--------|-------------|
| mAP@0.5 | Mean Average Precision at IoU 0.5 |
| mAP@0.5:0.95 | mAP averaged over IoU thresholds 0.5 to 0.95 |
| Precision-Recall curve | Per-class detection quality |

## Regression
| Metric | Description |
|--------|-------------|
| MAE | Mean Absolute Error |
| RMSE | Root Mean Squared Error |
| R-squared | Proportion of variance explained |

## Speech/OCR
| Metric | Description |
|--------|-------------|
| WER | Word Error Rate (lower is better) |
| CER | Character Error Rate |

## Recommendation Systems
| Metric | Description |
|--------|-------------|
| NDCG@k | Ranking quality at top-k |
| Hit Rate@k | User-relevant item in top-k |
| MAP | Mean Average Precision over users |

## Reporting
- Always report metrics on the held-out test set, never on training or validation data.
- Include confidence intervals or standard deviation across multiple runs.
- Report the baseline (random, majority class, or simple heuristic) for context.
