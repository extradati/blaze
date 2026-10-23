import "leaflet/dist/leaflet.css";
import "./style.css";
import { defineCustomElements } from "@ionic/core/loader";
import "@ionic/core/css/core.css";

import L from "leaflet";

defineCustomElements();

const map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 13,
  attributionControl: false,
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

window.addEventListener("resize", () => {
  map.invalidateSize();
});

window.addEventListener("orientationchange", () => {
  map.invalidateSize();
});
