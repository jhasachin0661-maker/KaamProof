# Model Serving and Inference

## FastAPI Serving
```python
from fastapi import FastAPI, UploadFile
import torch

app = FastAPI()
model = torch.load("model.pt")
model.eval()

@app.post("/predict")
async def predict(file: UploadFile):
    image = preprocess(await file.read())
    with torch.no_grad():
        output = model(image)
    return {"prediction": output.argmax().item(), "confidence": output.max().item()}

@app.get("/health")
def health():
    return {"status": "ok"}
```

## TorchServe
```bash
torch-model-archiver --model-name my_model --version 1.0 \
  --model-file model.py --serialized-file model.pt --handler handler.py
torchserve --start --model-store model_store --models my_model=my_model.mar
```

## TF Serving
```bash
docker run -p 8501:8501 \
  -v /models/my_model:/models/my_model \
  -e MODEL_NAME=my_model \
  tensorflow/serving
```

## Best Practices
- Always include a `/health` endpoint for load balancer health checks.
- Validate input dimensions and data types before inference.
- Use batch inference for throughput: collect requests and process in batches.
- Return confidence scores alongside predictions for downstream filtering.
- Log inference latency and errors for monitoring.
- Use ONNX Runtime for cross-framework serving with optimized inference.

## GPU Considerations
- Pin the model to a specific GPU with `CUDA_VISIBLE_DEVICES`.
- Monitor GPU memory usage; implement request queuing to prevent OOM.
- Consider model quantization (INT8) for 2-4x inference speedup with minimal accuracy loss.
