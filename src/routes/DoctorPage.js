import React, { useState, useEffect } from 'react';
import { Container, Card, TextField, Button, Typography, Box, CardContent } from '@material-ui/core';
import style from './DoctorPage.module.css';

const DOCTOR_ACCOUNT = "0x74Fd70d504e2C3cA1cBa72c41e5f46fC6D64A6d4";

export default function DoctorPage({
  doctor,
  setDoctor,
  addDoctor,
  currentAccount,
  doctorAccessContract, // Add this prop
  grantAccess // Add this prop
}) {
  const [loading, setLoading] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);

  const fetchAccessRequests = async () => {
    try {
      if (!doctorAccessContract || !currentAccount) {
        console.log('Contract or account not ready');
        return;
      }

      console.log('Fetching requests for doctor:', currentAccount);
      const requests = await doctorAccessContract.methods
        .getAccessRequests(currentAccount)
        .call();
      
      console.log('Raw requests:', requests);
      
      // Only filter if we got an array response
      if (Array.isArray(requests)) {
        const filteredRequests = requests.filter(request => 
          request !== '0x0000000000000000000000000000000000000000'
        );
        
        console.log('Filtered requests:', filteredRequests);
        setAccessRequests(filteredRequests);
      } else {
        console.log('No requests found or invalid response');
        setAccessRequests([]);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
      // Handle the error gracefully
      setAccessRequests([]);
    }
  };

  useEffect(() => {
    console.log('Doctor name:', doctor.name);
    console.log('Current account:', currentAccount);
    console.log('Contract available:', !!doctorAccessContract);

    if (doctor.name && currentAccount && doctorAccessContract) {
      fetchAccessRequests();
      
      // Refresh requests every 10 seconds
      const interval = setInterval(fetchAccessRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [doctorAccessContract, currentAccount, doctor.name]);

  const handleGrantAccess = async (patientAddress) => {
    try {
      await grantAccess(patientAddress);
      await fetchAccessRequests(); // Refresh the list after granting access
      alert('Access granted successfully');
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Failed to grant access');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctor.name || !doctor.specialization || !doctor.hospital) {
      alert('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current account
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Check if using correct account
      if (accounts[0].toLowerCase() !== DOCTOR_ACCOUNT.toLowerCase()) {
        alert('Please switch to the doctor account in MetaMask');
        return;
      }
      
      // Check if contract is ready
      if (!doctorAccessContract) {
        throw new Error('Contract not initialized. Please check your connection to MetaMask');
      }
      
      await addDoctor();
      alert('Doctor registered successfully!');
    } catch (error) {
      console.error('Error registering doctor:', error);
      alert('Failed to register doctor: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <div className={style.viewToggle}>
          <button className={`${style.toggleButton} ${style.inactive}`}>PATIENT VIEW</button>
          <button className={`${style.toggleButton} ${style.active}`}>DOCTOR VIEW</button>
        </div>
      </Box>

      <Card className={style.card}>
        <Typography variant="h5" component="h2" className={style.title} style={{ color: '#4CAF50', marginBottom: '24px' }}>
          DOCTOR REGISTRATION
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            variant="outlined"
            value={doctor.name || ''}
            onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
            disabled={loading}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Specialization"
            variant="outlined"
            value={doctor.specialization || ''}
            onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
            disabled={loading}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Hospital"
            variant="outlined"
            value={doctor.hospital || ''}
            onChange={(e) => setDoctor({ ...doctor, hospital: e.target.value })}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ 
              marginTop: '24px',
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '12px'
            }}
            disabled={loading}
          >
            {loading ? 'REGISTERING...' : 'REGISTER AS DOCTOR'}
          </Button>
        </form>
      </Card>

      <Card className={style.card} style={{ marginTop: '24px' }}>
        <Typography variant="h5" component="h2" className={style.title} style={{ color: '#4CAF50', marginBottom: '24px' }}>
          PATIENT ACCESS REQUESTS
        </Typography>
        {accessRequests.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No pending access requests
          </Typography>
        ) : (
          <div>
            {accessRequests.map((patientAddress, index) => (
              <Card key={index} style={{ marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    Patient Address: {patientAddress}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleGrantAccess(patientAddress)}
                  >
                    Grant Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}







