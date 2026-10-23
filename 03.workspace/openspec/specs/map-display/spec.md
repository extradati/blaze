# Map-display Specification

## Purpose

Defines the behavior of rendering a full-screen OpenStreetMap map in a mobile-first web application using Leaflet.js, including tile loading, viewport setup, attribution display, and responsive resizing.

## Requirements

### Requirement: Full-screen map rendering
The system SHALL render a full-screen OpenStreetMap map that fills the entire viewport on mobile and desktop devices.

#### Scenario: Map fills viewport
- **WHEN** the application loads on a mobile device
- **THEN** the map container occupies 100% of the viewport width and height

### Requirement: OpenStreetMap tile loading
The system SHALL load map tiles from OpenStreetMap's raster tile service.

#### Scenario: Tiles render
- **WHEN** the map initializes with a valid center and zoom level
- **THEN** OSM tiles load and display within the map container

### Requirement: Map attribution
The system SHALL display OpenStreetMap attribution as required by the tile provider's terms.

#### Scenario: Attribution visible
- **WHEN** the map is rendered
- **THEN** OpenStreetMap attribution text appears on the map

### Requirement: Map controls
The system SHALL provide visible and functional Leaflet controls for zoom and attribution.

#### Scenario: Zoom controls work
- **WHEN** the user interacts with the zoom controls
- **THEN** the map zoom level changes accordingly

### Requirement: Viewport resize handling
The system SHALL update the map layout when the browser viewport is resized or the device orientation changes.

#### Scenario: Resize updates map
- **WHEN** the viewport size changes
- **THEN** the map invalidates its size and redraws to fit the new viewport
