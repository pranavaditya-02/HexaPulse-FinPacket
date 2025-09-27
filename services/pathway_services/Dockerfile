FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services/pathway_services /app/services/pathway_services

ENV PYTHONPATH=/app
CMD ["python", "-m", "services.pathway_services.main"]
