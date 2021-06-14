# TODO

## Features:
 -[ ] Multiplayer system 

## Implementation details
 - [x] Testable transport
 - [ ] Adjust client/server time with simulation clock (Command Frame)
 - [ ] Simulation clock synchronization


# Communication
 - Server starts simulation when it starts
 - Ping/pong messages are used to measure RTT
 - Server and client uses the same update frequency for simulation
 - Server and client compensate the remainder of time
 - Clients send pure input
 - Server sends game state
