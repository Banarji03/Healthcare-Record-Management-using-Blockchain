
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@material-ui/core';

export default function DoctorAccess({ 
  requestDoctorAccess, 
  revokeAccess, 
  doctorAccessContract, 
  doctorDataContract,
  currentAccount 
}) {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);

  const validateDoctorAddress = (address) => {
    if (!address) {
      return 'Doctor address is required';
    }
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return 'Invalid Ethereum address format';
    }
    if (address.toLowerCase() === currentAccount.toLowerCase()) {
      return 'Cannot request access to your own address';
    }
    return '';
  };

  const handleDoctorAddressChange = (e) => {
    const address = e.target.value;
    setDoctorAddress(address);
    setAddressError(validateDoctorAddress(address));
  };

  const fetchAuthorizedDoctors = async () => {
    try {
      if (!doctorAccessContract) return;
      
      // Get the list of authorized doctors for the current patient
      const doctorsList = await doctorAccessContract.methods
        .getAuthorizedDoctors(currentAccount)
        .call();

      // Get details for each doctor
      const doctorsWithDetails = await Promise.all(
        doctorsList.map(async (address) => {
          try {
            const details = await doctorDataContract.methods.getDoctor(address).call();
            return {
              address,
              name: details[0] || 'Unknown',
              specialization: details[1] || 'Unknown',
              hospital: details[2] || 'Unknown'
            };
          } catch (error) {
            console.error(`Error fetching doctor details for ${address}:`, error);
            return {
              address,
              name: 'Unknown',
              specialization: 'Unknown',
              hospital: 'Unknown'
            };
          }
        })
      );

      setAuthorizedDoctors(doctorsWithDetails);
    } catch (error) {
      console.error('Error fetching authorized doctors:', error);
      setAuthorizedDoctors([]);
    }
  };

  useEffect(() => {
    fetchAuthorizedDoctors();
    
    // Set up an interval to refresh the list periodically
    const interval = setInterval(fetchAuthorizedDoctors, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [doctorAccessContract, currentAccount]);

  const handleRequestAccess = async () => {
    try {
      const error = validateDoctorAddress(doctorAddress);
      if (error) {
        setAddressError(error);
        return;
      }

      await requestDoctorAccess(doctorAddress);
      setDoctorAddress('');
      setAddressError('');
      fetchAuthorizedDoctors();
    } catch (error) {
      console.error('Error in handleRequestAccess:', error);
      const userMessage = error.message.includes('Internal JSON-RPC error')
        ? 'Transaction failed. Please check your connection and try again.'
        : error.message;
      setAddressError(userMessage);
    }
  };

  const handleRevokeAccess = async (doctorAddress) => {
    try {
      await revokeAccess(doctorAddress);
      fetchAuthorizedDoctors(); // Refresh the list after revoking access
    } catch (error) {
      console.error('Error revoking access:', error);
    }
  };

  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="h2" style={{ color: '#4dabf5', marginBottom: '20px' }}>
          AUTHORIZED DOCTORS
        </Typography>

        <div style={{ marginBottom: '20px' }}>
          <TextField
            fullWidth
            label="Doctor's Ethereum Address"
            value={doctorAddress}
            onChange={handleDoctorAddressChange}
            variant="outlined"
            error={!!addressError}
            helperText={addressError}
            style={{ marginBottom: '10px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestAccess}
            disabled={!doctorAddress || !!addressError}
          >
            Request Access
          </Button>
        </div>

        {authorizedDoctors.length === 0 ? (
          <Typography color="textSecondary">
            No doctors authorized yet
          </Typography>
        ) : (
          <div>
            {authorizedDoctors.map((doctor, index) => (
              <Card key={index} style={{ marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Typography variant="body1">Name: {doctor.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Specialization: {doctor.specialization}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hospital: {doctor.hospital}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Address: {doctor.address}
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRevokeAccess(doctor.address)}
                  >
                    Revoke Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}




