const ethers = require('ethers');
const { Web3Provider } = require('ethers/providers');
// import contractABI from './contractABI.js';

// Connect to MetaMask provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Load the RideHailing contract using its address and ABI
const contractAddress = '0x3B148D7b70A940015D9626D0878B5B5B6Fdbf8f5';
async function loadContractABI() {
  try {
    const response = await fetch('./contractABI.json');
    const json = await response.json();
    const contractABI = JSON.parse(json);
    
    // Use the contractABI in your code...
  } catch (error) {
    console.error(error);
  }
}

loadContractABI();

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Request MetaMask to connect
async function connectToMetaMask() {
  try {
    // Request user's permission to connect
    console.log("A");
    await window.ethereum.enable();
    // Refresh the page after connecting
    window.location.reload();
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

// Example function for getting the price per meter from the contract
async function getPricePerMeter() {
  try {
    const pricePerMeter = await contract.getPricePerMeter();
    console.log('Price per meter:', pricePerMeter.toString());
  } catch (error) {
    console.error(error);
  }
}

// Check if MetaMask is connected
if (window.ethereum) {
  // MetaMask is available
  connectToMetaMask(); // Automatically connect on page load
} else {
  // MetaMask is not available
  console.error('Please install MetaMask extension to use this application.');
}
