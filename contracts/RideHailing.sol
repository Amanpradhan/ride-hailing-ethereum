// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A Ride Hailing smart contract
contract RideHailing is Ownable {

        /// @dev Structure to hold ride information
        struct Ride {
            address payable rider;
            address payable driver;
            uint256 fare;   
            bool rideCompleted;
        }

        mapping (uint256 => Ride) public rides;
        mapping (address => bool) public registeredUsers;
        uint256 public rideCount;
        uint256 public pricePerMeter = 1000; // Assigning price per meter as 1000 weis

        event RideRequested(address indexed rider, uint256 indexed rideId, uint256 fare);
        event RideAccepted(address indexed  driver, uint256 indexed rideId);
        event UserRegistered(address indexed user);
        event RideCancelled(address indexed rider, uint256 indexed rideId);
        event RideCompleted(address indexed rider, uint256 indexed rideId);


        /// @notice Request a ride
        /// @param _distance The distance of the ride in meters
        function requestRide(uint256 _distance) public payable {
            require(registeredUsers[msg.sender], "User not registered");
            uint256 fare = calculateFare(_distance);
            require(msg.value >= fare, "Not enough funds sent");
            rides[rideCount] = Ride(payable(msg.sender), payable (address(0)), fare, false);
            emit RideRequested(msg.sender, rideCount, fare);
            rideCount++;
        }

        /// @notice Register a new user
         function registerUser() public {
            require(!registeredUsers[msg.sender], "User already registered");
            registeredUsers[msg.sender] = true;
            emit UserRegistered(msg.sender);
        }

        /// @dev Calculate fare based on distance
        /// @param _distance The distance of the ride in meters
        function calculateFare(uint256 _distance) internal view returns (uint256) {
            return _distance * pricePerMeter;
        }

        /// @notice Set the price per meter
        /// @param newPrice The new price per meter
        function setPricePerMeter(uint256 newPrice) external onlyOwner {
            pricePerMeter = newPrice;
        }

        /// @notice Get the price per meter
        function getPricePerMeter() public view returns (uint256) {
            return pricePerMeter;
        }

        /// @notice Accept a ride
        /// @param _rideId The ID of the ride to accept
        function acceptRide(uint256 _rideId) public {
            Ride storage ride = rides[_rideId];
            require(registeredUsers[msg.sender], "User not registered");
            require(ride.driver == address(0), "Ride already accepted");
            ride.driver = payable(msg.sender); // remove this and do it when complete/cancel ride
            emit RideAccepted(msg.sender, _rideId);
        }

        /// @notice Complete a ride
        /// @param _rideId The ID of the ride to complete
        function completeRide(uint256 _rideId) public payable {
            Ride storage ride = rides[_rideId];
            require(ride.rider == msg.sender, "Only rider can complete the ride");
            require(!ride.rideCompleted, "Ride already completed");
            require(msg.value >= ride.fare);
            // require(address(this).balance >= ride.fare, "Not enough funds to complete"); // add this while accepting a ride as well, incorrect, write payable
            ride.rideCompleted = true;
            emit RideCompleted(ride.rider, _rideId);
            ride.driver.transfer(ride.fare);
            // ride.driver.transfer(ride.fare);

        }

        /// @notice Cancel a ride
        /// @param _rideId The ID of the ride to cancel
        function cancelRide(uint256 _rideId) public payable {
            Ride storage ride = rides[_rideId];
            require(ride.rider == msg.sender, "Only rider can cancel the ride");
            require(ride.driver == address(0), "Ride already accepted, cannot cancel");
            require(!ride.rideCompleted, "Ride already completed");
            ride.rideCompleted = true;
            emit RideCancelled(msg.sender, _rideId);
            payable(ride.rider).transfer(ride.fare);
        }

        function getRide(uint256 _rideId) public view returns (Ride memory ride) {
            ride = rides[_rideId];
            // return (ride.rider, ride.driver, ride.fare, ride.rideCompleted);
        }

        receive() external payable {}
}