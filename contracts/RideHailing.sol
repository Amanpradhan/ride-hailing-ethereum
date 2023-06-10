// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";


/// @title A Ride Hailing smart contract
contract RideHailing is Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;

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

        address private oracle;
        bytes32 private jobId;
        uint private fee;

        constructor(address _oracle, bytes32 _jobId, uint256 _fee) {
            oracle = _oracle;
            jobId = _jobId;
            fee = _fee;
        }


        /// @notice Request a ride
        /// @param _pickup The pickup location
        /// @param _drop The drop location
        function requestRide(string memory _pickup, string memory _drop) public payable {
            require(registeredUsers[msg.sender], "User not registered");
            uint256 fare = calculateFare(_pickup, _drop);
            require(msg.value <= fare, "Not enough funds sent");
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
        /// @param _pickup The pickup location
        /// @param _drop The drop location
    
        function calculateFare(string memory _pickup, string memory _drop) internal  returns (uint256) {
            uint256 distance = calculateDistance(_pickup, _drop);
            return distance * pricePerMeter;
        }

        function getApiKey() internal view returns (string memory) {
            string memory apiKey = [DISTANCE_MATRIX_API_KEY];
            return apiKey;
        }

        /// @dev Callback function for Chainlink oracle response
        function fulfillPrice(bytes32 _requestId, uint256 _price) public returns (uint256) {
            return _price;
        }
        

        /// @dev Calculate distance based on address
        /// @param _pickup The pickup location
        /// @param _drop The drop location
        function calculateDistance(string memory _pickup, string memory _drop) internal returns (uint256) {
            Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillPrice.selector);
            request.add("url", "https://maps.googleapis.com/...");
            request.add("queryParams", string(abi.encode("Pickup=", _pickup, "&drop=", _drop, "&api_key=", getApiKey())));
            bytes32 b = sendChainlinkRequestTo(oracle, request, fee);
            uint256 a = 1;
            return a;
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