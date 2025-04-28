# Blockchain-based Patient Data Management System

A decentralized application (DApp) for secure management of patient medical records using Ethereum blockchain technology.


## Prerequisites

1. **Ganache**
   - Download and install from [Ganache](https://trufflesuite.com/ganache/)
   - Used for local blockchain development

2. **MetaMask**
   - Install the [MetaMask browser extension](https://metamask.io/)
   - Required for blockchain interactions

3. **Node.js and npm**
   - Required for running the React application

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ethereum-patient-data-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy Smart Contracts**
   ```bash
   # Start Ganache and select "Quick Start"
   truffle migrate --reset
   ```

4. **Update Contract Addresses**
   After deployment, update the following files with the new contract addresses from the migration output:
   - `src/contracts/DoctorData.js`
   - `src/contracts/DoctorAccess.js`
   - `src/contracts/SaveData.js`
   - `src/contracts/PatientData.js`

5. **MetaMask Configuration**
   - Connect MetaMask to your local Ganache network (usually `http://localhost:7545`)
   - Import a doctor account using the private key from Ganache
   - Default doctor address: `0x74Fd70d504e2C3cA1cBa72c41e5f46fC6D64A6d4`
   - Ensure the account has sufficient ETH for transactions

6. **Start the Application**
   ```bash
   npm start
   ```

## Features

### Patient Data Management
- Add new patient records with personal and medical information
- Fields include:
  - Patient ID
  - Name
  - Birth Date
  - Phone Number
  - Address
  - Medical Report ID
  - Weight (kg)
  - Height (cm)
  - Blood Group
  - Disease Name
  - Disease Description
  - Disease Start Date

### Data Security
- All patient data is encrypted using AES-256 encryption
- Data is stored on the blockchain in encrypted form
- Access control through smart contracts
- Two-layer encryption process:
  1. Client-side encryption using SHA-256 generated keys
  2. Server-side encryption for additional security

### Doctor Access Control
- Doctors can request access to patient records
- Patients can grant/revoke access to their records
- Access management through smart contracts

## Technical Architecture

### Smart Contracts
1. **PatientData.sol**
   - Manages patient medical records
   - Stores encrypted patient data
   - Handles data access control

### React Components
1. **AddData.js**
   - Handles patient biographical data input
   - Form validation and data preprocessing

2. **AddMedicalData.js**
   - Manages medical record input
   - Validates medical data before blockchain storage

3. **ShowData.js**
   - Displays patient medical records in a tabular format
   - Handles data retrieval and formatting

### Data Flow
1. User inputs patient data
2. Data is validated and encrypted client-side
3. Encrypted data is sent to the blockchain
4. Access control is managed through smart contracts
5. Authorized users can retrieve and decrypt data

## Error Handling
- Input validation for all required fields
- Numeric validation for weight and height
- Transaction error handling with user feedback
- Network connectivity checks
- MetaMask connection validation

## Security Considerations
- Use of AES-256 encryption for data security
- Smart contract access control
- Two-factor authentication for doctors
- Encrypted data transmission
- Private key management through MetaMask

## Known Issues and Limitations
- Requires MetaMask for all transactions
- Limited to Ethereum blockchain
- Requires local blockchain for development
- Gas costs for all transactions


