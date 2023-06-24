// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { ethers } from "./node_modules/ethers/dist/ethers.esm.min.js";
import { contractABI } from './contractABI.js';

// Use the contractABI in your code...

// const { Web3Provider } = require('ethers/providers');
// import contractABI from './contractABI.js';
// console.log("ABI = ", contractABI);
const requestButton = document.getElementById('requestButton');
const registerUserButton = document.getElementById('registerUserButton');

const pickupInput = document.getElementById('pickupInput');
const dropInput = document.getElementById('dropInput');
const connectButton = document.getElementById('connectButton');
const cancelRideButton = document.getElementById('cancelButton');
const completeRideButton = document.getElementById('completeButton');


requestButton.addEventListener('click', () => {
    const pickup = pickupInput.value;
    const drop = dropInput.value;
    requestRide(pickup, drop);
});

registerUserButton.addEventListener('click', () => {
    registeredUser();
});

connectButton.addEventListener('click', connectToMetaMask);

// Connect to MetaMask provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Load the RideHailing contract using its address and ABI
const contractAddress = '0xDD98A7F52E27E3071AA5654718F6b000d703a213';

// async function loadContractABI() {
//   try {
//     const response = await fetch('./contractABI.json');
//     const json = await response.json();
//     const contractABI = JSON.parse(json);

//     // Use the contractABI in your code...
//   } catch (error) {
//     console.error(error);
//   }
// }

// loadContractABI();

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Request MetaMask to connect
async function connectToMetaMask() {
    try {
        // Request user's permission to connect
        console.log("A");
        const metamask = await window.ethereum.enable();
        console.log("connected", metamask)
        // Refresh the page after connecting
        // window.location.reload();
    } catch (error) {
        console.error(error);
    }
}

// Example function for interacting with the contract
async function requestRide(pickup, drop) {
    try {
        // Call the contract function
        const tx = await contract.requestRide(pickup, drop, { value: ethers.utils.parseEther('0.1') });
        await tx.wait();
        console.log('Ride requested');
    } catch (error) {
        console.error(error);
    }
}

async function registeredUser() {
    try {
        const registerUser = await contract.registerUser();
        console.log("Registered User = ", registerUser);
    } catch (error) {
        console.log(error);
    }
}

// Example function for getting the price per meter from the contract
async function getPricePerMeter() {
    try {
        const pricePerMeter = await contract.getPricePerMeter();
        console.log('Price per meter:', pricePerMeter.toString());
    } catch (error) {
        console.error(error);
    }
}

// Example function for canceling a ride
async function cancelRide(rideId) {
  try {
    const tx = await contract.cancelRide(rideId, { value: ethers.utils.parseEther('0') });
    await tx.wait();
    console.log('Ride canceled');
  } catch (error) {
    console.error(error);
  }
}

// Bind cancel ride button to cancelRide function
cancelRideButton.addEventListener('click', async () => {
  const rideId = 0;
  await cancelRide(rideId);
});

async function completeRide(rideId) {
  try {
    const tx = await contract.completeRideAndRateDriver(rideId, 5, { value: ethers.utils.parseEther('0') });
    await tx.wait();
    console.log('Ride completed');
  } catch (error) {
    console.error(error);
  }
}

completeRideButton.addEventListener('click', async () => {
  const rideId = 0;
  await completeRide(rideId);
});

// Check if MetaMask is connected
if (window.ethereum) {
    // MetaMask is available
    connectToMetaMask(); // Automatically connect on page load
} else {
    // MetaMask is not available
    console.error('Please install MetaMask extension to use this application.');
}
