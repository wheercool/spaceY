# Asteroids game

[Demo](https://spacey-wheercool.surge.sh/)

## Architecture:

ECS - Entity Component System

Entity - id with list Components

Component - data, describing some properties, state of the entity

System - logic, that creates new, updates or remove existing entities according some rules

Systems together create a pipe. Each pass through pipe makes an iteration.

System doesn't know about each other, they only operate components and entities.

Entity doesn't know about either system or components.

Component doesn't know about either system or entity.

