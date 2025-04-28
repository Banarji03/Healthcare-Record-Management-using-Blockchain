
const PatientData = artifacts.require("PatientData");
const SaveData = artifacts.require("SaveData");
const DoctorData = artifacts.require("DoctorData");
const DoctorAccess = artifacts.require("DoctorAccess");

module.exports = function(deployer) {
  deployer.deploy(PatientData);
  deployer.deploy(SaveData);
  deployer.deploy(DoctorData);
  deployer.deploy(DoctorAccess);
};
