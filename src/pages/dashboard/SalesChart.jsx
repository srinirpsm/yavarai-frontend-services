import { useEffect, useState } from 'react';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// Chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Completed', 'Pending'] // Status categories
  },
  yaxis: {
    title: {
      text: 'Tasks Count'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `${val} tasks`;
      }
    }
  },
  legend: {
    show: false
  }
};

export default function SalesChart() {
  const theme = useTheme();
  const [series, setSeries] = useState([{ name: 'Tasks', data: [0, 0] }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        const data =  response.data; 

        // Count tasks by status
        const completedTasks = data.filter(task => task.status === 'Completed').length;
        const pendingTasks = data.filter(task => task.status === 'Pending').length;

        setSeries([{ name: 'Tasks', data: [completedTasks, pendingTasks] }]);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" color="secondary">
            Task Status Reports
          </Typography>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={columnChartOptions} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}
