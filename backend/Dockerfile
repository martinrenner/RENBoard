FROM python:3.12-slim

# Zabraňuje vytváření pyc souborů (tohle stejně nefunguje dle očekávání :D)
ENV PYTHONDONTWRITEBYTECODE 1 
# Zabraňuje bufferování výstupu
ENV PYTHONUNBUFFERED 1

WORKDIR /backend

COPY ./requirements.txt /backend
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./src /backend/src

WORKDIR /backend/src

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]