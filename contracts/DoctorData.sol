// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DoctorData {
    struct Doctor {
        string name;
        string specialization;
        string hospital;
    }

    mapping(address => Doctor) public doctors;

    function addDoctor(string memory _name, string memory _specialization, string memory _hospital) public {
        doctors[msg.sender] = Doctor(_name, _specialization, _hospital);
    }

    function getDoctor(address _doctorAddress) public view returns (string memory, string memory, string memory) {
        Doctor memory doc = doctors[_doctorAddress];
        return (doc.name, doc.specialization, doc.hospital);
    }
}
