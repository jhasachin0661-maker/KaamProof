# PyTorch and TensorFlow Training Patterns

## PyTorch Training Loop
```python
import torch
from torch.utils.data import DataLoader

model = MyModel().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
criterion = torch.nn.CrossEntropyLoss()

for epoch in range(num_epochs):
    model.train()
    for batch in train_loader:
        inputs, labels = batch
        optimizer.zero_grad()
        outputs = model(inputs.to(device))
        loss = criterion(outputs, labels.to(device))
        loss.backward()
        optimizer.step()

    # Validation
    model.eval()
    with torch.no_grad():
        val_loss = evaluate(model, val_loader)
    print(f"Epoch {epoch}: val_loss={val_loss:.4f}")
```

## TensorFlow/Keras Training
```python
import tensorflow as tf

model = tf.keras.Sequential([...])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(train_ds, validation_data=val_ds, epochs=50,
          callbacks=[tf.keras.callbacks.EarlyStopping(patience=5)])
```

## Reproducibility Checklist
1. Set random seeds: `torch.manual_seed(42)`, `tf.random.set_seed(42)`, `np.random.seed(42)`.
2. Use deterministic algorithms: `torch.use_deterministic_algorithms(True)`.
3. Pin dependency versions in `requirements.txt`.
4. Log hyperparameters, dataset version, and hardware info.
5. Save model checkpoints with optimizer state for resumable training.

## Common Pitfalls
- Forgetting `model.eval()` and `torch.no_grad()` during validation (causes memory leaks and incorrect batch norm behavior).
- Data leakage: applying augmentation or normalization statistics computed on test data.
- Not using mixed precision (`torch.cuda.amp`, `tf.keras.mixed_precision`) for GPU training.
