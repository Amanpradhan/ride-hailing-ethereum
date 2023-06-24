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
            string estdTime;
            uint256 rating;
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
        event RequestVolume(bytes32 _requestId, string _status);
        event DriverRated(address indexed rider, uint256 indexed rideId, uint256 rating);

        address private oracle;
        bytes32 private jobId;
        uint private fee;
        uint256 public distance;
        string public status;
        // uint256 public fare;
        // string public estdTime;

        constructor() {
            setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // 
            setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3);
            oracle = 0x40193c8518BB267228Fc409a613bDbD8eC5a97b3;
            // jobId ="ca98366cc7314957b8c012c72f05aeeb"; //  for uint256
            jobId = "7d80a6386ef543a3abb52817f6707e3b"; // for string
            fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18 (Varies by network and job)
            distance = 10; // hard code this for now and will populate ride struct with chainllink response
            // fare = 0; //need to change this later
            // estdTime = ""; //need to change this later
        }


        /// @notice Register a new user
         function registerUser() public {
            require(!registeredUsers[msg.sender], "User already registered");
            registeredUsers[msg.sender] = true;
            emit UserRegistered(msg.sender);
        }

        /// @notice Request a ride
        /// @param _pickup The pickup location
        /// @param _drop The drop location
        function requestRide(string memory _pickup, string memory _drop) public payable  {
            require(registeredUsers[msg.sender], "User not registered");
            calculateFare(_pickup, _drop);
            require(msg.value >= 0, "Not enough funds sent"); // TODO: set 0 to actual fare vallue
            rides[rideCount] = Ride(payable(msg.sender), payable (address(0)), 0, false, "", 0);
            emit RideRequested(msg.sender, rideCount, 0);
            rideCount++;
            
        }

        /// @dev Calculate fare based on distance
        function calculateFare(string memory _pickup, string memory _drop) internal  returns (uint256) {
            calculateDistance(_pickup, _drop);
            return surgePricing(distance * pricePerMeter);
        }

        function getApiKey() internal pure returns (string memory) {
            string memory apiKey = "AIzaSyDF0rgz17j9QPI94NwD8RPic8ktViw8yIU";
            return apiKey;
        }

        function surgePricing(uint256 baseFare) internal view returns (uint256) {
            uint256 surgeMultiplier = 100;
            uint256 currentHour = (block.timestamp / 3600) % 24; // Get the current hour
            if ((currentHour >= 9 && currentHour < 11) || (currentHour >= 16 && currentHour < 18) || (currentHour >= 0 && currentHour < 4)) {
                surgeMultiplier = 133; // 1.33x surge pricing
            }
            return (baseFare * surgeMultiplier) / 100;
        }

        /// @dev Callback function for Chainlink oracle response
        function fulfillDistance(bytes32 _requestId, string memory _status) public recordChainlinkFulfillment(_requestId) {
            emit RequestVolume(_requestId, _status);
            status = _status;
        }

        /// @dev requestRide based on address
        function calculateDistance(string memory _pickup, string memory _drop) internal {
            Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillDistance.selector);
            string memory baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";
            string memory units = "imperial";
            string memory queryParams = string(abi.encodePacked("origins=", _pickup, "&destinations=", _drop, "&units=", units, "&key=", getApiKey()));
            req.add("get", string(abi.encodePacked(baseUrl, "?", queryParams)));
            // req.add("path", "rows, 0, elements, 0, distance, text");
            // req.add("path", "destination_addresses, 0");
            req.add("path", "status");
            sendChainlinkRequest(req, fee);
    
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
        function completeRideAndRateDriver(uint256 _rideId, uint256 _rating) public payable {
            Ride storage ride = rides[_rideId];
            require(ride.rider == msg.sender, "Only rider can complete the ride");
            require(!ride.rideCompleted, "Ride already completed");
            require(msg.value >= ride.fare);
            // require(address(this).balance >= ride.fare, "Not enough funds to complete"); // add this while accepting a ride as well, incorrect, write payable
            ride.rideCompleted = true;
            ride.rating = _rating;
            emit RideCompleted(ride.rider, _rideId);
            emit DriverRated(ride.rider, _rideId, _rating);
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