# Spec Delta

## MODIFIED Requirements

### Requirement: Map attribution
The system SHALL NOT render OpenStreetMap attribution on the map interface; attribution is provided in a separate app section instead.

#### Scenario: No map attribution
- **WHEN** the map is rendered
- **THEN** no OpenStreetMap attribution text appears on the map

### Requirement: Map controls
The system SHALL provide visible and functional Leaflet controls for zoom only; the attribution control is removed.

#### Scenario: Zoom controls work
- **WHEN** the user interacts with the zoom controls
- **THEN** the map zoom level changes accordingly
