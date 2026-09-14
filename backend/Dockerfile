FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    DATA_DIR=/data

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ENV UV_COMPILE_BYTECODE=1 \
    # Install into the system Python rather than a virtual environment.
    UV_SYSTEM_PYTHON=1

# Copied on its own so the dependency layer stays cached across code changes.
COPY requirements.txt .
RUN uv pip install --no-cache -r requirements.txt

COPY . .
RUN chmod +x entrypoint.sh

EXPOSE 5000
CMD ["./entrypoint.sh"]
