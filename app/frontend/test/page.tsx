"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/test")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => {
                console.error(err);
                setMessage("Error: " + err.message);
            });
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Laravel API Test</h1>
            <p>{message}</p>
        </div>
    );
}
