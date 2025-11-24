import adafruit_dht
import board

dht = adafruit_dht.DHT11(board.D4)

try:
    temperature_c = dht.temperature
    humidity = dht.humidity
    print(f"Temp: {temperature_c} C  Humidity: {humidity}%")
except RuntimeError as e:
    print(f"Error reading from DHT11: {e}")