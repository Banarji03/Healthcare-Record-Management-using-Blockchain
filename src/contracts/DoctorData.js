// Use the address from your local deployment (from DoctorData.json)
export const DOCTOR_DATA_ADDRESS = "0xa6b4CfC4DA1A4167f1eA282F49EB55751eA6CA7a";
export const DOCTOR_DATA_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_name", "type": "string" },
      { "name": "_specialization", "type": "string" },
      { "name": "_hospital", "type": "string" }
    ],
    "name": "addDoctor",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_doctorAddress", "type": "address" }],
    "name": "getDoctor",
    "outputs": [
      { "name": "", "type": "string" },
      { "name": "", "type": "string" },
      { "name": "", "type": "string" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
