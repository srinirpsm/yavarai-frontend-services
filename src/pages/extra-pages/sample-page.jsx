import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Select, MenuItem, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle 
} from '@mui/material';
import MainCard from 'components/MainCard';

const API_URL = 'http://127.0.0.1:8000/tasks';
const AUTH_TOKEN = localStorage.getItem("access_token");

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('');
  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: '', description: '', priority: '', due_date: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [priority]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(priority ? `${API_URL}?priority=${priority}` : API_URL, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/complete`, {}, { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setTaskData({ title: '', description: '', priority: '', due_date: '' });
    setEditMode(false);
    setOpen(true);
  };

  const openUpdateForm = (task) => {
    setTaskData({ title: task.title, description: task.description, priority: task.priority, due_date: task.due_date });
    setEditMode(true);
    setEditId(task.id);
    setOpen(true);
  };

  const submitTask = async () => {
    try {
      if (editMode) {
        // Update Task
        await axios.put(`${API_URL}/${editId}`, taskData, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' }
        });
      } else {
        // Create New Task
        await axios.post(API_URL, taskData, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' }
        });
      }
      fetchTasks();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <MainCard title="Task Manager">
      <Typography variant="h6">Filter by Priority:</Typography>
      <Select value={priority} onChange={(e) => setPriority(e.target.value)} displayEmpty sx={{ mb: 2 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="High">High</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Low">Low</MenuItem>
      </Select>

      <Button variant="contained" color="primary" onClick={openCreateForm} sx={{ ml: 1 }}>
        Create Task
      </Button>

      

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sno</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{index + 1}</TableCell> {/* Serial Number */}
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {task.status !== 'Completed' && (
                    <Button variant="contained" color="success" onClick={() => completeTask(task.id)}>Complete</Button>
                  )}
                  <Button variant="contained" color="error" onClick={() => deleteTask(task.id)} sx={{ ml: 1 }}>Delete</Button>
                  <Button variant="contained" color="primary" onClick={() => openUpdateForm(task)} sx={{ ml: 1 }}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Form for Create/Update Task */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Update Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Select
            name="priority"
            value={taskData.priority}
            onChange={handleInputChange}
            fullWidth
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Select Priority</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
          <TextField
            label="Due Date"
            name="due_date"
            type="date"
            value={taskData.due_date}
            onChange={handleInputChange}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={submitTask} color="primary" variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
