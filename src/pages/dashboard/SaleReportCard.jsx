import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project import
import SalesChart from './SalesChart';

// Filter options for the report
const status = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export default function SaleReportCard() {
  const [value, setValue] = useState('today');
  const [taskData, setTaskData] = useState({ completed: 0, pending: 0 });
 

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Sales Report</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="report-filter"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Pass the processed task data to SalesChart */}
      <SalesChart/>
    </>
  );
}
