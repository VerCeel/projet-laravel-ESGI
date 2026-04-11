import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NavBar from "./components/static/NavBar";
import Footer from "./components/static/Footer";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NavBar />
    <div className="pt-24 pb-20 w-full h-screen mx-auto overflow-y-auto bg-neutral-900 text-neutral-100">
      <App />
    </div>
    <Footer />
  </StrictMode>,
);
