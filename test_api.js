fetch('http://localhost:8000/api/responses')
    .then(res => {
        console.log("Status:", res.status);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    })
    .then(data => {
        console.log("Data length:", data.length);
        if (data.length > 0) {
            console.log("First record:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("Data is empty array.");
        }
    })
    .catch(err => console.error("Fetch error:", err));
