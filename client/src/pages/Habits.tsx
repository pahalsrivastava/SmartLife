import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { useHabitStore } from '../stores/habits';

export default function Habits() {
  const { habits, addHabit, deleteHabit, toggleToday } = useHabitStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>Habits</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Habit
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {habits.map((h) => {
          const done = h.datesCompleted.includes(today);
          return (
            <Grid item xs={12} md={6} lg={4} key={h.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{h.name}</Typography>
                      <Chip size="small" label={h.frequency} sx={{ mt: 1 }} />
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton color={done ? 'success' : 'default'} onClick={() => toggleToday(h.id)}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteHabit(h.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Habit</DialogTitle>
        <DialogContent>
          <Stack mt={1} spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField
              label="Frequency"
              select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!name.trim()) return;
              addHabit({ name: name.trim(), frequency });
              setName('');
              setFrequency('daily');
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}