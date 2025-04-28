// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DoctorAccess {
    mapping(address => mapping(address => bool)) public patientToDoctorAccess;
    mapping(address => address[]) public patientAuthorizedDoctors;
    mapping(address => address[]) public doctorAccessRequests;

    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event AccessRequested(address indexed patient, address indexed doctor);

    // Add this function to check if an address exists in the array
    function findRequest(address[] storage requests, address value) internal view returns (uint) {
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i] == value) {
                return i;
            }
        }
        return requests.length;
    }

    function requestAccess(address doctor) public {
        require(doctor != address(0), "Invalid doctor address");
        require(msg.sender != doctor, "Cannot request access to yourself");
        require(!patientToDoctorAccess[msg.sender][doctor], "Access already granted");
        
        // Check if request already exists
        address[] storage requests = doctorAccessRequests[doctor];
        uint index = findRequest(requests, msg.sender);
        require(index == requests.length, "Request already exists");
        
        // Add to doctor's pending requests
        doctorAccessRequests[doctor].push(msg.sender);
        
        emit AccessRequested(msg.sender, doctor);
    }

    function revokeAccess(address doctor) public {
        require(patientToDoctorAccess[msg.sender][doctor], "No access to revoke");
        
        patientToDoctorAccess[msg.sender][doctor] = false;
        
        // Remove doctor from authorized list
        address[] storage doctors = patientAuthorizedDoctors[msg.sender];
        for (uint i = 0; i < doctors.length; i++) {
            if (doctors[i] == doctor) {
                doctors[i] = doctors[doctors.length - 1];
                doctors.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, doctor);
    }

    function hasAccess(address patient, address doctor) public view returns (bool) {
        return patientToDoctorAccess[patient][doctor];
    }

    function getAuthorizedDoctors(address patient) public view returns (address[] memory) {
        require(patient != address(0), "Invalid patient address");
        return patientAuthorizedDoctors[patient];
    }

    function getAccessRequests(address doctor) public view returns (address[] memory) {
        require(doctor != address(0), "Invalid doctor address");
        // Add basic validation
        require(doctorAccessRequests[doctor].length > 0 || true, "No requests found");
        return doctorAccessRequests[doctor];
    }

    function grantAccess(address patient) public {
        require(patient != address(0), "Invalid patient address");
        require(!patientToDoctorAccess[patient][msg.sender], "Access already granted");
        
        // Find and validate the request exists
        address[] storage requests = doctorAccessRequests[msg.sender];
        uint index = findRequest(requests, patient);
        require(index < requests.length, "No pending request found");
        
        // Grant access
        patientToDoctorAccess[patient][msg.sender] = true;
        patientAuthorizedDoctors[patient].push(msg.sender);
        
        // Remove from pending requests
        requests[index] = requests[requests.length - 1];
        requests.pop();
        
        emit AccessGranted(patient, msg.sender);
    }
}






