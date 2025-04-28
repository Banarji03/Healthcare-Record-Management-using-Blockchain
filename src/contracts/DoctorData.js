// Use the address from your local deployment (from DoctorData.json)
export const DOCTOR_DATA_ADDRESS = "0xA440F8CE56cd1eC3078Bb4B28f07C7a699F8DDB3";
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
