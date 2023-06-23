# RideHailing Ethereum Smart Contract

This is a decentralized application (dApp) built on the Ethereum blockchain. It's a ride-hailing smart contract similar to Uber, but decentralized.

## Overview

The `RideHailing` contract allows users to request, accept, complete, and cancel rides. Each ride has a fare which is calculated based on the distance of the ride.

## Getting Started

1. Clone the repository to your local machine.
    git clone .git
2. Install the required Node.js packages:
    npm install
3. Compile the contract:
    npx hardhat compile
4. Run tests:
    npx hardhat test
5. You can also deploy the contract to a local Hardhat Network:
    npx hardhat run scripts/deploy.js


## Structure

- Ride: A struct that represents a ride with fields for the rider, driver, fare, and a boolean to indicate if the ride has been completed.
- rides: A mapping from ride IDs to Ride structs.
- registeredUsers: A mapping from addresses to booleans indicating if a user is registered.
- rideCount: A counter to keep track of the total number of rides.
- pricePerMeter: The fare per meter for a ride.

## Events

- RideRequested: Emitted when a ride is requested.
- RideAccepted: Emitted when a ride is accepted.
- UserRegistered: Emitted when a user is registered.
- RideCancelled: Emitted when a ride is cancelled.
- RideCompleted: Emitted when a ride is completed.

## Functions

- requestRide: Allows a registered user to request a ride.
- registerUser: Registers a new user.
- calculateFare: Calculates the fare for a ride based on the distance.
- setPricePerMeter: Sets the fare per meter for a ride. This function is restricted to the contract owner.
- getPricePerMeter: Returns the current fare per meter.
- acceptRide: Allows a registered user to accept a ride.
- completeRide: Allows a rider to complete a ride.
- cancelRide: Allows a rider to cancel a ride.
- getRide: Returns the details of a ride.


## Upcoming Features

1. Getting distance through maps - done - to do tomorrow
2. Giving user estimated time - done - to do tomorrow
3. Adding surge pricing : office hours, night time - Done - to do tomorrow
4. Giving driver rating - done
5. Front end (trying to add through ethersjs) - done - make separate frontend (See)
6. Feature for adding a range for the estimated pricing - not sure how to do
7. Find way to safeguard api key - to do today
8. Add change to build request properly - done
9. Assign fare and time correctly

TODO: assume KYC, implement later (driver)
