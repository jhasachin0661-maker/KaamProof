# YOLO Object Detection

## Setup (Ultralytics YOLOv8)
```bash
pip install ultralytics
```

## Dataset Format (YOLO)
```
dataset/
├── images/
│   ├── train/
│   ├── val/
│   └── test/
├── labels/
│   ├── train/
│   ├── val/
│   └── test/
└── data.yaml
```

`data.yaml`:
```yaml
path: ./dataset
train: images/train
val: images/val
test: images/test
names:
  0: class_a
  1: class_b
```

## Training
```python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')  # pretrained nano model
results = model.train(data='data.yaml', epochs=100, imgsz=640, patience=20)
```

## Inference
```python
model = YOLO('runs/detect/train/weights/best.pt')
results = model.predict('test_image.jpg', conf=0.5)
for box in results[0].boxes:
    print(box.xyxy, box.cls, box.conf)
```

## Key Parameters
- `imgsz`: Input image size (640 default, use 1280 for small objects).
- `patience`: Early stopping patience on val mAP.
- `conf`: Confidence threshold for predictions.
- `augment`: Enable test-time augmentation for better accuracy.

## Export
```python
model.export(format='onnx')  # Also supports torchscript, tflite, coreml
```
