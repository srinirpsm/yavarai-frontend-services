import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

const headCells = [
  { id: 'id', align: 'left', label: 'Sr No.' },
  { id: 'description', align: 'left', label: 'Description' },
  { id: 'sentiment', align: 'right', label: 'Sentiment' },
  { id: 'sentiment_score', align: 'left', label: 'Sentiment Score' },
  { id: 'priority', align: 'right', label: 'Priority' }
];

// Table Header
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Order Status Component
function OrderStatus({ priority }) {
  let color;
  switch (priority) {
    case 'High':
      color = 'error';
      break;
    case 'Medium':
      color = 'warning';
      break;
    case 'Low':
      color = 'success';
      break;
    default:
      color = 'primary';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{priority}</Typography>
    </Stack>
  );
}

OrderStatus.propTypes = { priority: PropTypes.string };

// Main Table Component
export default function OrderTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("access_token");


    axios.get(`${API_URL}/tasks/insights`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("API Response:", response.data);
      setData(response.data.tasks || []);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      setData([]);
      setLoading(false);
    });
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table>
          <OrderTableHead />
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Link color="secondary">{row.id}</Link>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">{row.sentiment}</TableCell>
                  <TableCell>{row.sentiment_score}</TableCell>
                  <TableCell align="right">
                    <OrderStatus priority={row.priority} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tasks available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
