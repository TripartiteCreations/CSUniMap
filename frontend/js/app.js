
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

/// map
const map = L.map("map");

async function loadCampus() {
    try {
        const response = await fetch("/api/map");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const mapData = await response.json();

        console.log("Loaded map data:", mapData);

        const campusLayer = L.geoJSON(mapData);

        campusLayer.addTo(map);

        map.fitBounds(campusLayer.getBounds());

    } catch (error) {
        console.error("Failed to load campus map:", error);
    }
}

loadCampus();
//testBackend();

