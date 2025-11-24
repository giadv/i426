from typing import Generator

# from adafruit_dht import DHT11
# from board import D4
from time import sleep

# _dht = DHT11(D4)


def temperature_c() -> Generator[str]:
    while True:
        try:
            # temp = _dht.temperature
            temp = 25.0  # Placeholder for actual sensor reading
            if temp is not None:
                yield f"data: {temp}\n\n"
        except RuntimeError:
            continue
        sleep(5)

def humidity() -> Generator[str]:
    while True:
        try:
            # hum = _dht.humidity
            hum = 50.0  # Placeholder for actual sensor reading
            if hum is not None:
                yield f"data: {hum}\n\n"
        except RuntimeError:
            continue
        sleep(5)
