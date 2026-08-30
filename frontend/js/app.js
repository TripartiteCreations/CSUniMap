
/// test coms

async function testBackend() {
    try {
        const response = await fetch("http://localhost:8080/api/test");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Backend response:", data);

        document.getElementById("result").textContent = data.message;
    }
    catch (error) {
        console.error("Backend connection failed:", error);
        document.getElementById("result").textContent =
            "Backend connection failed.";
    }
}

// map
const map = L.map("map", {
    zoomControl: false,
    attributionControl: false,
});

const styles = {
    buildings: { color: "#8a5a34", weight: 1, fillColor: "#c98a56", fillOpacity: 0.8 },
    roads: { color: "#4a4038", weight: 2.5, opacity: 0.9 },
    water: { color: "#3f7086", weight: 1, fillColor: "#6fa8bf", fillOpacity: 0.75 },
    vegetation: { color: "#4f6b41", weight: 1, fillColor: "#7c9b6b", fillOpacity: 0.65 },
};

function categorize(feature) {
    const props = feature.properties || {};

    if (props.building) return "buildings";
    if (props.highway) return "roads";
    if (props.natural === "water") return "water";
    if (
        props.landuse === "grass" ||
        props.landuse === "forest" ||
        props.natural === "wood"
    ) return "vegetation";

    return null;
}

const layers = {
    buildings: L.geoJSON(null, { style: styles.buildings }),
    roads: L.geoJSON(null, { style: styles.roads }),
    water: L.geoJSON(null, { style: styles.water }),
    vegetation: L.geoJSON(null, { style: styles.vegetation }),
};

const legendItems = [
    { key: "buildings", label: "Buildings", color: styles.buildings.fillColor },
    { key: "roads", label: "Roads", color: styles.roads.color },
    { key: "water", label: "Water", color: styles.water.fillColor },
    { key: "vegetation", label: "Vegetation", color: styles.vegetation.fillColor },
];

function buildLegend() {
    const container = document.getElementById("legend");

    legendItems.forEach(item => {
        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                layers[item.key].addTo(map);
            } else {
                map.removeLayer(layers[item.key]);
            }
        });

        const swatch = document.createElement("span");
        swatch.className = "swatch";
        swatch.style.background = item.color;

        label.append(checkbox, swatch, document.createTextNode(item.label));
        container.appendChild(label);
    });
}

// Build a circular GeoJSON boundary sized to comfortably enclose the
// bounding box of the loaded data, centered on that data.
function buildCircularBoundary(geojson, paddingKm = 0.05) {
    const bbox = turf.bbox(geojson);                      // [minX, minY, maxX, maxY]
    const bboxPolygon = turf.bboxPolygon(bbox);
    const center = turf.center(bboxPolygon);
    const corner = turf.point([bbox[0], bbox[1]]);
    const radiusKm = turf.distance(center, corner, { units: "kilometers" }) + paddingKm;

    return turf.circle(center, radiusKm, { steps: 96, units: "kilometers" });
}

async function loadCampus() {
    try {
        const response = await fetch("/api/map");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const mapData = await response.json();

        mapData.features.forEach(feature => {
            const category = categorize(feature);
            if (category) layers[category].addData(feature);
        });

        // Circular boundary, sized from the actual data footprint
        const campusCircle = buildCircularBoundary(mapData);

        const clippedTiles = new L.TileLayer.BoundaryCanvas(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                boundary: campusCircle,
                maxZoom: 19,
            }
        );
        clippedTiles.addTo(map);

        const bounds = [];
        Object.values(layers).forEach(layer => {
            layer.addTo(map);
            if (layer.getLayers().length) bounds.push(layer.getBounds());
        });

        // Fit to the circle itself so the disc is filled edge-to-edge,
        // rather than just the (usually smaller) feature bounds
        const circleBounds = L.geoJSON(campusCircle).getBounds();
        map.fitBounds(circleBounds, { padding: [0, 0] });

    } catch (error) {
        console.error("Failed to load campus map:", error);
    }
}

buildLegend();
loadCampus();
//testBackend();

