# Docker & Container Error Guide

## Symptoms & Error Codes
- `Container exited with code 137` (Out of Memory)
- `bind: address already in use`
- `docker build failed: Command returned non-zero code`

## Usual Causes
1. Container ran out of memory (OOM killed).
2. Host port is already bound by another local process.
3. Missing build dependencies in multi-stage `Dockerfile`.

## Diagnostic Commands
- Check docker status: `docker ps -a` or `docker logs <container_id>`

## Safe Fixes
- Change host port mapping in `docker-compose.yml` (e.g. `8080:80`).
- Increase container memory limits or optimize node/python memory usage.
