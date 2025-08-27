import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.css"; // Optional: your custom CSS

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
