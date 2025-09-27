FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services/api /app/services/api
COPY services/pathway_services/utils /app/services/pathway_services/utils

ENV PYTHONPATH=/app

EXPOSE 8080
CMD ["uvicorn", "services.api.app:app", "--host", "0.0.0.0", "--port", "8080"]
