import { createRoot } from "react-dom/client";
/** Direction artistique — Carnet de confiance. Ce point d’entrée active l’expérience installable sans bloquer le rendu initial. */
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
