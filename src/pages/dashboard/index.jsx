import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';
import axios from 'axios';

export default function DashboardDefault() {
  const [taskStats, setTaskStats] = useState({
    overall: 0,
    completed: 0,
    pending: 0,
    todayDues: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        const completed = data.filter(task => task.status === 'Completed').length;
        const pending = data.filter(task => task.status === 'Pending').length;
        const todayDues = data.filter(task => new Date(task.due_date).toDateString() === new Date().toDateString()).length;
        const overall = data.length;

        setTaskStats({ overall, completed, pending, todayDues });
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Overall Tasks" count={taskStats.overall} percentage={59.3} extra="35,000" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Completed" count={taskStats.completed} percentage={70.5} extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Pending" count={taskStats.pending} percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Dues" count={taskStats.todayDues} percentage={27.4} isLoss color="warning" extra="$20,395" />
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">AI Insights</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard />
      </Grid>
    </Grid>
  );
}
