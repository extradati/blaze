# Spec Delta

## MODIFIED Requirements

### Requirement: Full-screen map rendering
The system SHALL render a full-screen OpenStreetMap map that fills the available viewport on mobile and desktop devices, sharing viewport ownership with a visible empty Ionic header and a visible empty Ionic footer.

#### Scenario: Map renders alongside Ionic header and footer
- **WHEN** the application loads with Ionic custom elements registered and the Leaflet map initialized
- **THEN** the map occupies the viewport space not taken by the Ionic header and footer
