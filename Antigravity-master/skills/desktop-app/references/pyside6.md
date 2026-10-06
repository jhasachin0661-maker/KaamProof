# PySide6 / Python Desktop

## Widget Architecture
- PySide6 (Qt for Python) uses a widget tree: `QApplication` owns top-level `QMainWindow` or `QWidget` instances.
- Layouts (`QVBoxLayout`, `QHBoxLayout`, `QGridLayout`) manage widget placement; avoid absolute positioning.
- Signals and slots connect UI events to handlers: `button.clicked.connect(self.on_click)`.

## Threading
- Never perform blocking I/O or long computation on the main (GUI) thread; the UI will freeze.
- Use `QThread` with a worker object or `QThreadPool` with `QRunnable`.
- Communicate results back via signals (thread-safe in Qt).

```python
class Worker(QObject):
    finished = Signal(str)
    def run(self):
        result = expensive_operation()
        self.finished.emit(result)

thread = QThread()
worker = Worker()
worker.moveToThread(thread)
thread.started.connect(worker.run)
worker.finished.connect(self.handle_result)
thread.start()
```

## Packaging
- Use PyInstaller or cx_Freeze for single-file or directory-based distribution.
- `--onefile` mode bundles everything; `--onedir` is faster to launch and easier to debug.
- Include Qt plugins and platform libraries; test on a clean machine to catch missing deps.
- For Windows: create NSIS or Inno Setup installer wrapping the PyInstaller output.

## System Integration
- System tray: `QSystemTrayIcon` with `QMenu`.
- File dialogs: `QFileDialog.getOpenFileName()`.
- Settings persistence: `QSettings` for cross-platform registry/config storage.
- Notifications: `QSystemTrayIcon.showMessage()` or platform-native via `plyer`.
