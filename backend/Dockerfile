FROM python:3.12-slim
RUN apt-get update && apt-get install -y \
    libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0 \
    fonts-liberation libfontconfig1 libgdk-pixbuf2.0-0 \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -m appuser
WORKDIR /app
COPY pyproject.toml .
RUN pip install -e .
COPY . .
RUN chown -R appuser /app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
