const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RideHailing", function() {
  let RideHailing;
  let rideHailing;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function() {
    RideHailing = await ethers.getContractFactory("RideHailing");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    rideHailing = await RideHailing.deploy();
    await rideHailing.deployed();
  });

  describe("User registration", function() {
    it("Should register a new user", async function() {
      await rideHailing.connect(addr1).registerUser();
      expect(await rideHailing.registeredUsers(addr1.address)).to.equal(true);
    });

    it("Should fail if user is already registered", async function() {
      await rideHailing.connect(addr1).registerUser();

      await expect(
        rideHailing.connect(addr1).registerUser()
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Ride requests", function() {
    it("Should fail if user is not registered", async function() {
      await expect(
        rideHailing.connect(addr1).requestRide("taj mahal", "red fort")
      ).to.be.revertedWith("User not registered");
    });

    it("Should request a ride if user is registered", async function() {
      await rideHailing.connect(addr1).registerUser();

      await expect(
        rideHailing.connect(addr1).requestRide("taj mahal", "red fort", {value: ethers.utils.parseEther("0.1")})
      ).to.emit(rideHailing, 'RideRequested');
    });
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rideHailing.owner()).to.equal(owner.address);
    });

    it("Should set the initial price per meter", async function () {
      await rideHailing.setPricePerMeter(1000);
      expect(await rideHailing.getPricePerMeter()).to.equal(1000);
    });
  });

  describe("Accepting, completing, and canceling rides", function () {
    it("Should accept a ride", async function () {
      // Register the users
      await rideHailing.connect(addr1).registerUser();
      await rideHailing.connect(addr2).registerUser();
  
      // Request a ride
      await rideHailing.connect(addr1).requestRide("taj mahal", "red fort", { value: 1000000 });
  
      // Accept the ride
      await rideHailing.connect(addr2).acceptRide(0);
      const ride = await rideHailing.getRide(0);
      expect(ride.driver).to.equal(addr2.address);
    });
  
    it("Should complete a ride", async function () {
      // Register the users
      await rideHailing.connect(addr1).registerUser();
      await rideHailing.connect(addr2).registerUser();
  
      // Request and accept a ride
      await rideHailing.connect(addr1).requestRide("taj mahal", "red fort", { value: 1000000 });
      await rideHailing.connect(addr2).acceptRide(0);
  
      // Complete the ride
      const rideBeforeCompletion = await rideHailing.getRide(0);
      await rideHailing.connect(addr1).completeRide(0, { value: rideBeforeCompletion.fare });
      const rideAfterCompletion = await rideHailing.getRide(0);
      expect(rideAfterCompletion.rideCompleted).to.equal(true);
    });
  
    it("Should cancel a ride", async function () {
      // Register the user and request a ride
      await rideHailing.connect(addr1).registerUser();
      await rideHailing.connect(addr1).requestRide("taj mahal", "red fort", { value: 10000 });
  
      // Cancel the ride
      await rideHailing.connect(addr1).cancelRide(0);
      const ride = await rideHailing.getRide(0);
      expect(ride.rideCompleted).to.equal(true);
    });
  });
  
});
