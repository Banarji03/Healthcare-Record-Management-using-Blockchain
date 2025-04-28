module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Match Ganache's port
      network_id: "*",       // Match any network id
      gas: 5000000          // Gas limit
    }
  },
  compilers: {
    solc: {
      version: "0.5.0",    // Match your solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
