
import { Box, Card, CardContent, Container, Paper, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import style from './App.module.css';
import { PATIENT_DATA_LIST_ADDRESS, PATIENT_DATA_LIST_ABI } from './contracts/PatientData';
import {
  SAVE_DATA_LIST_ADDRESS,
  SAVE_DATA_LIST_ABI
} from './contracts/SaveData';
import {
  DOCTOR_DATA_ADDRESS,
  DOCTOR_DATA_ABI
} from './contracts/DoctorData';
import {
  DOCTOR_ACCESS_ADDRESS,
  DOCTOR_ACCESS_ABI
} from './contracts/DoctorAccess';

// Route imports
import Add from './routes/Add';
import AddData from './routes/AddData';
import AddMedicalData from './routes/AddMedicalData';
import ShowData from './routes/ShowData';
import DoctorPage from './routes/DoctorPage';
import DoctorAccess from './routes/DoctorAccess';

// Utility imports
import CryptoJS from 'crypto-js';
import sendToServerForSecondEncryption from './server/sendToServerForSecondEncryption';

const DOCTOR_ACCOUNT = "0x74Fd70d504e2C3cA1cBa72c41e5f46fC6D64A6d4";

function App() {
  // Web3 and account states
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  
  // Contract states
  const [patientDataContract, setPatientDataContract] = useState([]);
  const [saveDataContract, setSaveDataContract] = useState([]);
  const [doctorDataContract, setDoctorDataContract] = useState(null);
  const [doctorAccessContract, setDoctorAccessContract] = useState(null);
  
  // Data states
  const [patientDataList, setPatientDataList] = useState([]);
  const [patientBioMedList, setPatientBioMedList] = useState([]);
  const [patientMedicalDataList, setPatientMedicalDataList] = useState([]);
  
  // View states
  const [currentView, setCurrentView] = useState('patient'); // 'patient' or 'doctor'
  const [isDoctor, setIsDoctor] = useState(false);
  
  // Doctor states
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    hospital: ""
  });
  
  // Patient states
  const [patientBio, setPatientBio] = useState({
    id: 'PATDHCS2001457',
    name: 'Banarji',
    birthDate: '2004-06-06', // Changed to ISO format YYYY-MM-DD
    phoneNumber: '1234565432',
    _address: '22/18/2 shanthi nagar,Hongasandra,Bangalore',
  });
  
  const [patientMedicalData, setPatientMedicalData] = useState({
    medReportId: 'MEDREP' + Math.ceil(Math.random() * 1000000000),
    weight: '158',
    height: '164',
    bloodGroup: 'B+',
    diseaseName: 'Hyper Myopia',
    diseaseDescription: 'caused by long exposure to harmful artificial blue light',
    diseaseStartedOn: '2024-04-01', // Changed to ISO format YYYY-MM-DD
  });

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Initialize PatientData contract
          const patientDataContractInstance = new web3Instance.eth.Contract(
            PATIENT_DATA_LIST_ABI,
            PATIENT_DATA_LIST_ADDRESS
          );
          setPatientDataContract(patientDataContractInstance);

          // Initialize other contracts...
          
        } else {
          alert('Please install MetaMask to use this application');
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
        alert('Failed to load web3 or contracts. Please check console for details.');
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (patientDataContract && account) {
      updateList(patientDataContract, account);
    }
  }, [patientDataContract, account]);

  const updateList = async (patientDataContract, acc) => {
    try {
      if (!patientDataContract || !acc) {
        console.error('Contract or account not initialized');
        return;
      }

      // Get sender info
      const senders = await patientDataContract.methods.senders(acc).call();
      const patientCount = parseInt(senders.patientCount);
      
      let patientBioMedList = [];

      // Fetch data for each patient
      for (let i = 0; i < patientCount; i++) {
        try {
          // Get patient bio data
          const patientData = await patientDataContract.methods.getPatientsList(i).call({ from: acc });
          
          // Get medical report data
          const medicalReport = await patientDataContract.methods.medicalReports(patientData[4]).call();

          // Combine the data
          patientBioMedList.push({
            name: patientData[0],
            birthDate: patientData[1],
            phoneNumber: patientData[2],
            address: patientData[3],
            weight: medicalReport.weight,
            height: medicalReport.height,
            bloodGroup: medicalReport.bloodGroup,
            diseaseName: medicalReport.diseaseName,
            diseaseDescription: medicalReport.diseaseDescription,
            diseaseStartedOn: medicalReport.diseaseStartedOn
          });
        } catch (error) {
          console.error(`Error fetching patient ${i}:`, error);
        }
      }

      console.log('Retrieved patient data:', patientBioMedList);
      setPatientBioMedList(patientBioMedList);
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const decryptEncryptedList = async (saveDataContract) => {
    let patientBioMedList = []

    const totalMedicalReports = await saveDataContract.methods.totalMedicalReports().call()
    for(let i = 0; i < totalMedicalReports; ++i)
    {
      const {
        hashOfOriginalDataString,
        secondTimeEncryptedString,
        sender,
        medReportId
      } = await saveDataContract.methods.data(i).call()
      let firstCiphertext = sendToServerForSecondEncryption
              .decryptSecondCipherText(secondTimeEncryptedString, sender, medReportId)
      let originalDataObject = JSON.parse(CryptoJS.AES.decrypt(firstCiphertext, hashOfOriginalDataString).toString(CryptoJS.enc.Utf8));
      console.log(originalDataObject)
      let rowData = {...originalDataObject.patientBio, ...originalDataObject.patientMedicalData}
      patientBioMedList.push(rowData)
    }
    console.log(patientBioMedList)
    setPatientBioMedList(patientBioMedList)
  }

  // const addUpdatePatientBio = () => {
  //   patientDataContract.methods
  //     .addUpdatePatientBio(
  //       patientBio.name,
  //       patientBio.birthDate,
  //       patientBio.phoneNumber,
  //       patientBio._address,
  //     )
  //     .send({ from: account })
  //     .once('receipt', (receipt) => {
  //       console.log('saved')
  //       updateList(patientDataContract, account)
  //     })
  // }

  const addUpdatePatientMedicalData = async () => {
    try {
      if (!patientDataContract) {
        alert('Please wait for contract initialization');
        return;
      }

      // Convert weight and height to numbers
      const weight = parseInt(patientMedicalData.weight);
      const height = parseInt(patientMedicalData.height);

      // Validate the values
      if (isNaN(weight) || isNaN(height)) {
        alert('Weight and height must be valid numbers');
        return;
      }

      // Add medical report
      await patientDataContract.methods
        .addMedicalReport(
          patientBio.id,
          patientBio.name,
          patientBio.birthDate,
          patientBio.phoneNumber,
          patientBio._address,
          patientMedicalData.medReportId,
          weight,
          height,
          patientMedicalData.bloodGroup,
          patientMedicalData.diseaseName,
          patientMedicalData.diseaseDescription,
          patientMedicalData.diseaseStartedOn
        )
        .send({ from: account });

      // Update the list after successful addition
      await updateList(patientDataContract, account);

      // Reset medical report ID
      setPatientMedicalData({
        ...patientMedicalData,
        medReportId: 'MEDREP' + Math.ceil(Math.random() * 1000000000)
      });

      alert('Medical data added successfully!');

    } catch (error) {
      console.error('Error details:', error);
      alert(`Error adding medical data: ${error.message || 'Unknown error'}`);
    }
  };

  const addDoctor = async () => {
    await doctorDataContract.methods
      .addDoctor(doctor.name, doctor.specialization, doctor.hospital)
      .send({ from: account });
    alert("Doctor added successfully!");
  };

  const getDoctor = async (doctorAddress) => {
    try {
      // Basic validation for Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(doctorAddress)) {
        alert('Please enter a valid Ethereum address');
        return;
      }
      
      const doctorDetails = await doctorDataContract.methods.getDoctor(doctorAddress).call();
      console.log("Doctor Details:", doctorDetails);
      // You can add UI feedback here to display the doctor's details
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      alert('Error fetching doctor details. Please check the address and try again.');
    }
  };

  const requestDoctorAccess = async (doctorAddress) => {
    try {
      if (!doctorAccessContract || !doctorDataContract) {
        throw new Error('Contracts not initialized');
      }

      if (!web3.utils.isAddress(doctorAddress)) {
        throw new Error('Invalid doctor address format');
      }

      // Check if doctor address is same as current account
      if (doctorAddress.toLowerCase() === account.toLowerCase()) {
        throw new Error('Cannot request access to yourself');
      }

      // Check if access is already granted
      const hasAccess = await doctorAccessContract.methods
        .hasAccess(account, doctorAddress)
        .call();
      
      if (hasAccess) {
        throw new Error('Access already granted for this doctor');
      }

      // Verify if the address is a registered doctor
      const doctorDetails = await doctorDataContract.methods
        .getDoctor(doctorAddress)
        .call();
      
      if (!doctorDetails[0]) {
        throw new Error('This address is not registered as a doctor');
      }

      // Send the transaction with gas estimation
      const gasEstimate = await doctorAccessContract.methods
        .requestAccess(doctorAddress)
        .estimateGas({ from: account });

      const tx = await doctorAccessContract.methods
        .requestAccess(doctorAddress)
        .send({ 
          from: account,
          gas: Math.round(gasEstimate * 1.2) // Add 20% buffer to gas estimate
        });
      
      console.log('Request transaction:', tx);
      alert('Access request sent to doctor successfully');

      // Verify the request was recorded
      const requests = await doctorAccessContract.methods
        .getAccessRequests(doctorAddress)
        .call();
      console.log('Current requests for doctor:', requests);

    } catch (error) {
      console.error('Error requesting access:', error);
      // Extract the relevant error message
      const errorMessage = error.message.includes('Internal JSON-RPC error') 
        ? 'Transaction failed. Please check your connection and try again.'
        : error.message;
      alert('Error requesting access: ' + errorMessage);
      throw error;
    }
  };

  const grantAccess = async (patientAddress) => {
    try {
      await doctorAccessContract.methods.grantAccess(patientAddress)
        .send({ from: account });
      alert('Access granted to patient');
    } catch (error) {
      alert('Error granting access');
      console.error(error);
    }
  };

  const revokeAccess = async (doctorAddress) => {
    try {
      await doctorAccessContract.methods.revokeAccess(doctorAddress)
        .send({ from: account });
      alert('Access revoked successfully');
    } catch (error) {
      alert('Error revoking access');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" className={style.container}>
      <div className={style.viewToggle}>
        <Button 
          onClick={() => setCurrentView('patient')}
          variant={currentView === 'patient' ? 'contained' : 'outlined'}
          color="primary"
        >
          Patient View
        </Button>
        <Button 
          onClick={() => setCurrentView('doctor')}
          variant={currentView === 'doctor' ? 'contained' : 'outlined'}
          color="primary"
          style={{ marginLeft: '10px' }}
        >
          Doctor View
        </Button>
      </div>

      {currentView === 'doctor' ? (
        <DoctorPage 
          doctor={doctor}
          setDoctor={setDoctor}
          addDoctor={async () => {
            try {
              await doctorDataContract.methods
                .addDoctor(doctor.name, doctor.specialization, doctor.hospital)
                .send({ from: account });
              setIsDoctor(true);
              alert('Doctor registered successfully!');
            } catch (error) {
              console.error('Error registering doctor:', error);
              throw error;
            }
          }}
          currentAccount={account}
          doctorAccessContract={doctorAccessContract}
          grantAccess={grantAccess}
        />
      ) : (
        <>
          <Add
            patientBio={patientBio}
            setPatientBio={setPatientBio}
            patientMedicalData={patientMedicalData}
            setPatientMedicalData={setPatientMedicalData}
            addUpdatePatientMedicalData={addUpdatePatientMedicalData}
          />
          <ShowData patientBioMedList={patientBioMedList} />
          <DoctorAccess 
            requestDoctorAccess={requestDoctorAccess}
            revokeAccess={revokeAccess}
            doctorAccessContract={doctorAccessContract}
            doctorDataContract={doctorDataContract}
            currentAccount={account}
          />
        </>
      )}
    </Container>
  );
}

export default App
