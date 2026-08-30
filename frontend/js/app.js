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

testBackend();