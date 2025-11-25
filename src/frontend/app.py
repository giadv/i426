from flask import Flask, render_template, Response
from backend.app import temperature_c, humidity

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/game")
def game():
    return render_template("game.html")


@app.route("/streams/temperature")
def stream_temperature():
    return Response(temperature_c(), mimetype="text/event-stream")


@app.route("/streams/humidity")
def stream_humidity():
    return Response(humidity(), mimetype="text/event-stream")
