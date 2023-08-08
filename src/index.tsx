import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import "./styles.css";
// import "bootstrap/dist/css/bootstrap.css";

// Create a new root element
const rootElement = document.createElement("div");
rootElement.id = "root";

// Append the root element to the body
document.body.appendChild(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <div className="app-container">
      <App />
    </div>
  </React.StrictMode>,
  rootElement
);
