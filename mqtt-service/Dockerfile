FROM python:3.6

WORKDIR /app

# COPY src/mqtt-service/requirements.txt ./

# RUN pip install -r requirements.txt

COPY src/mqtt-service /app

RUN pip install -r requirements.txt
ENV PYTHONPATH "${PYTHONPATH}:/app"
CMD ["python", "src/mqtt_service.py"]