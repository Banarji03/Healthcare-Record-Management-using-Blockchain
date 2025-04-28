import React, { useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import style from './AddData.module.css'
import style2 from './ShowData.module.css'
import { Card } from '@material-ui/core'
import moment from 'moment'

export default function ShowData(props) {
  const { patientBioMedList } = props;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "") {
      return "N/A";
    }

    try {
      const dateObj = moment(dateString);
      if (!dateObj.isValid()) {
        return dateString; // Return original string if not valid date
      }
      
      return dateObj.format('DD/MM/YYYY');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={style2.showDataContainer}>
      <Card className={style2.card}>
        <h2 className={style.h2}>Patient's Medical Data</h2>
        <TableContainer component={Paper}>
          <Table className={style.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sno.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Birth Date</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Weight (kg)</TableCell>
                <TableCell>Height (cm)</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Disease Name</TableCell>
                <TableCell style={{minWidth:'200px'}}>Disease Description</TableCell>
                <TableCell>Disease Started On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientBioMedList && patientBioMedList.length > 0 ? (
                patientBioMedList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.birthDate)}</TableCell>
                    <TableCell>{row.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>{row.address || 'N/A'}</TableCell>
                    <TableCell>{row.weight || 'N/A'}</TableCell>
                    <TableCell>{row.height || 'N/A'}</TableCell>
                    <TableCell>{row.bloodGroup || 'N/A'}</TableCell>
                    <TableCell>{row.diseaseName || 'N/A'}</TableCell>
                    <TableCell>{row.diseaseDescription || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.diseaseStartedOn)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No patient data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
