# Hugging Face Transformers

## Model Hub
- Browse models at huggingface.co/models. Filter by task (image-classification, object-detection, text-classification, etc.).
- Prefer models with high downloads and recent updates. Check the model card for license, training data, and known limitations.

## Pipeline API (Quick Start)
```python
from transformers import pipeline

# Image classification
classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
result = classifier("cat.jpg")

# Text classification
sentiment = pipeline("sentiment-analysis")
result = sentiment("This product is excellent!")
```

## Fine-Tuning with Trainer
```python
from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments

model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)
trainer = Trainer(model=model, args=training_args, train_dataset=train_ds, eval_dataset=val_ds)
trainer.train()
```

## Best Practices
- Use `AutoModel` and `AutoTokenizer` for automatic architecture detection.
- Cache models locally with `TRANSFORMERS_CACHE` env var to avoid repeated downloads.
- Use `model.half()` or `bitsandbytes` for quantized inference to reduce GPU memory.
- Always verify the model's expected input format (image size, tokenizer, preprocessing).
