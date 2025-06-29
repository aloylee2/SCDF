FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# Enable debug mode for Testing, Disable when deploying to production - Kaibao
ENV FLASK_DEBUG=1 

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
