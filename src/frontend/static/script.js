// @ts-nocheck
const tempStream = new EventSource("/streams/temperature");
const humStream = new EventSource("/streams/humidity");

const header = document.querySelector("header");
const boxes = document.querySelectorAll(".data-box");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");

// red, orange, blue
const hotColors = {
    boxes: "rgba(255, 79, 71, 0.762)",
    unit: "rgba(255, 79, 71, 0.7)",
    header: "rgba(255, 79, 71, 0.498)",
};
const warmColors = {
    boxes: "rgba(255, 165, 0, 0.762)",
    unit: "rgba(255, 165, 0, 0.8)",
    header: "rgba(255, 165, 0, 0.498)",
};
const coolColors = {
    boxes: "rgba(110, 188, 248, 0.762)",
    unit: "rgb(110, 188, 248)",
    header: "rgba(110, 188, 248, 0.498)",
};

const MIN_TEMP = 15;
const MAX_TEMP = 35;

let temperature = 0;
let humidity = 0;

const selectedUnit = () =>
    document.querySelector('input[name="unit"]:checked').value;

const normalize = (value, min = MIN_TEMP, max = MAX_TEMP) => {
    return (value - min) / (max - min);
};

const getTemperatureText = (unit) => {
    switch (unit) {
        case "celsius":
            return temperature + " °C";
        case "fahrenheit":
            return toFahrenheit(temperature).toFixed(2) + " °F";
        default:
            return temperature + " °C";
    }
};

const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

const handleUnitChange = () => {
    updateTemperatureText();
    updateColor();
};

const updateTemperatureText = () => {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    temperatureElement.textContent = getTemperatureText(unit);
};

const setTemperature = (temp) => {
    if (temp !== undefined) {
        temperature = temp;
    }

    updateTemperatureText();
    updateColor();
};

const setHumidity = (hum) => {
    humidityElement.textContent = `${hum.toFixed(2)} %`;
};

const setColor = (headerColor, unitColor, boxesColor) => {
    header.style.borderBottomColor = headerColor;
    boxes.forEach((box) => {
        box.style.borderColor = boxesColor;
    });
    updateUnitColors(unitColor);
};

const updateUnitColors = (color) => {
    const unit = selectedUnit();
    const selectedLabel = document.querySelector(
        `input[value="${unit}"] + label`
    );
    const unselectedLabel = document.querySelector(
        `input[value="${
            unit === "celsius" ? "fahrenheit" : "celsius"
        }"] + label`
    );

    selectedLabel.style.color = color;
    unselectedLabel.style.color = "rgb(208, 208, 208)";
};

const parseRgba = (rgba) => {
    const match = rgba.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1,
    };
};

const interpolateColor = (color1, color2, factor) => {
    const c1 = parseRgba(color1);
    const c2 = parseRgba(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    const a = c1.a + (c2.a - c1.a) * factor;

    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
};

const getGradientColor = (colorType) => {
    const normalized = Math.min(Math.max(normalize(temperature), 0), 1);

    let color1, color2, factor;

    if (normalized < 0.5) {
        // Cool to Warm: 0 to 0.5
        color1 = coolColors[colorType];
        color2 = warmColors[colorType];
        factor = normalized * 2; // 0 to 1
    } else {
        // Warm to Hot: 0.5 to 1
        color1 = warmColors[colorType];
        color2 = hotColors[colorType];
        factor = (normalized - 0.5) * 2; // 0 to 1
    }

    return interpolateColor(color1, color2, factor);
};

const updateColor = () => {
    const headerColor = getGradientColor("header");
    const unitColor = getGradientColor("unit");
    const boxesColor = getGradientColor("boxes");

    setColor(headerColor, unitColor, boxesColor);
};

tempStream.onmessage = (event) => {
    temperature = parseFloat(event.data);
    setTemperature(temperature);
    updateColor();
};

humStream.onmessage = (event) => {
    humidity = parseFloat(event.data);
    setHumidity(humidity);
};
