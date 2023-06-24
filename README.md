# RideHailing Ethereum Smart Contract
This is a decentralized application (dApp) built on the Ethereum blockchain. It's a ride-hailing smart contract similar to Uber, but decentralized.

Table of Contents
Overview
Getting Started
Smart Contract Structure
Events
Functions
Flowchart
Upcoming Features
Overview
The RideHailing smart contract allows users to request, accept, complete, and cancel rides. Each ride has a fare calculated based on the distance traveled. The contract uses the Chainlink oracle to retrieve distance data from the Google Maps API and applies surge pricing during peak hours. It also supports user registration and driver ratings.

## Getting Started
To get started with the RideHailing smart contract, follow these steps:

1. Clone the repository to your local machine.
2. Install the required Node.js packages:
- npm install
3. Compile the contract:
- npx hardhat compile
4. Run tests:
- npx hardhat test
5. Deploy the contract to a local Hardhat Network:
- npx hardhat run scripts/deploy.js

## Smart Contract Structure
The RideHailing smart contract consists of the following main components:

Ride: A struct that holds ride information, including the rider, driver, fare, completion status, estimated time, and rating.
rides: A mapping from ride IDs to Ride structs to store ride data.
registeredUsers: A mapping from addresses to booleans indicating if a user is registered.
rideCount: A counter to keep track of the total number of rides.
pricePerMeter: The fare per meter for a ride.

## Events
The smart contract emits the following events:

RideRequested: Emitted when a ride is requested.
RideAccepted: Emitted when a ride is accepted by a driver.
UserRegistered: Emitted when a new user is registered.
RideCancelled: Emitted when a ride is cancelled by the rider.
RideCompleted: Emitted when a ride is completed by the rider.
RequestVolume: Emitted when the Chainlink oracle responds with the distance data.
DriverRated: Emitted when the rider rates the driver after completing a ride.

## Functions
The smart contract provides the following functions:

registerUser: Allows a user to register as a new user.
requestRide: Allows a registered user to request a ride by specifying the pickup and drop locations.
calculateFare: Calculates the fare for a ride based on the distance traveled.
setPricePerMeter: Sets the fare per meter for a ride (restricted to the contract owner).
getPricePerMeter: Returns the current fare per meter.
acceptRide: Allows a registered user (driver) to accept a ride.
completeRideAndRateDriver: Allows the rider to complete a ride and rate the driver.
cancelRide: Allows the rider to cancel a ride.
getRide: Returns the details of a ride.

## Flowchart

The flowchart above illustrates the flow of the RideHailing smart contract. Users can register, request rides, accept rides, complete rides, or cancel rides. The contract keeps track of ride details, calculates fares, and emits events for each significant action.



