# WebSocket & Real-time Communication

## Handler Architecture
- Authenticate WebSocket connection upgrade requests using JWT or session tokens before opening sockets.
- Handle connection heartbeat (`ping`/`pong`) to prune dead sockets.
- Use pub/sub adapters (Redis Pub/Sub) when scaling WebSocket servers across multiple instances.
