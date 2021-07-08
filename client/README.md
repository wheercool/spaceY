# TODO: 
 - [ ] Add modal dialog with Complete/Fail notifications
 - [ ] Add SoundService that can play sounds
 - [ ] Integrate SoundService


# Issues
- First meeting of asteroid/planet cause lag
- Sometimes asteroid hides behind planet. Should I use zIndex to put them on the different layer?
# Asteroids game

## Architecture:

ECS - Entity Component System

Entity - id with list Components

Component - data, describing some properties, state of the entity

System - logic, that creates new, updates or remove existing entities according some rules

Systems together create a pipe. Each pass through pipe makes an iteration.

System doesn't know about each other, they only operate components and entities.
Entity doesn't know about either system or components.
Component doesn't know about either system or entity.

## Main systems:
### Compositor
Compositor orders system together. Also, it counts iterations
### Input 
Input holds information about pressed keys and so on and pass it to 
interested in it systems through controller component
### Renderer
Displays sprite/3D model



