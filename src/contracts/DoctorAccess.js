export const DOCTOR_ACCESS_ADDRESS = "0xE23128765ABca53dECe007b33e983934739b9E26";

// Verify these events are in your ABI
export const DOCTOR_ACCESS_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "patientToDoctorAccess",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "doctorAccessRequests",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "AccessRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "AccessRevoked",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "requestAccess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "patient",
        "type": "address"
      },
      {
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "hasAccess",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "getAccessRequests",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "getAuthorizedDoctors",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];



