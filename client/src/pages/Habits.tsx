import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {  gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import dayjs from 'dayjs';
import {Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';

const GET_USER_HABITS = gql`
  query GetUserHabits($clerk_id: String!) {
    users(where: { clerk_id: { _eq: $clerk_id } }) {
      id
      habits {
        id
        title
        frequency
        start_date
        habit_logs {
          id
          date
          completed
        }
      }
    }
  }
`;

const ADD_HABIT = gql`
  mutation AddHabit($user_id: uuid!, $title: String!, $frequency: String!, $start_date: date!) {
    insert_habits_one(
      object: { user_id: $user_id, title: $title, frequency: $frequency, start_date: $start_date }
    ) {
      id
      title
      frequency
      start_date
    }
  }
`;

const TOGGLE_HABIT = gql`
  mutation ToggleHabit($habit_id: uuid!, $user_id: uuid!, $date: date!) {
    insert_habit_logs_one(
      object: { habit_id: $habit_id, user_id: $user_id, date: $date, completed: true }
      on_conflict: { constraint: habit_logs_pkey, update_columns: completed }
    ) {
      id
      date
      completed
    }
  }
`;

const DELETE_HABIT = gql`
  mutation DeleteHabit($id: uuid!) {
    delete_habits_by_pk(id: $id) {
      id
    }
  }
`;


interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  start_date: string;
  habit_logs: { id: string; date: string; completed: boolean }[];
}

export default function Habits() {
  const { isLoaded, user } = useUser();
  const today = dayjs().format('YYYY-MM-DD');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  interface GetUserHabitsData {
    users: {
      id: string;
      habits: {
        id: string;
        title: string;
        frequency: 'daily' | 'weekly';
        start_date: string;
        habit_logs: { id: string; date: string; completed: boolean }[];
      }[];
    }[];
  }
  interface GetUserHabitsVars {
    clerk_id: string;
  }
  const { data, refetch } = useQuery<GetUserHabitsData, GetUserHabitsVars>(GET_USER_HABITS, {
    variables: { clerk_id: user?.id || '' },
    skip: !isLoaded || !user?.id,
  });
  const [addHabitMutation] = useMutation(ADD_HABIT);
  const [toggleHabitMutation] = useMutation(TOGGLE_HABIT);
  const [deleteHabitMutation] = useMutation(DELETE_HABIT);
  const habits: Habit[] = data?.users?.[0]?.habits || [];
  const user_id: string = data?.users?.[0]?.id || '';
  const toggleToday = async (habit_id: string) => {
    if (!user_id) return;
    await toggleHabitMutation({ variables: { habit_id, user_id, date: today } });
    refetch();
  };
  const deleteHabit = async (habit_id: string) => {
    if (!user_id) return;
    await deleteHabitMutation({ variables: { id: habit_id } });
    refetch();
  };
  const addHabit = async (title: string, frequency: 'daily' | 'weekly') => {
    if (!user_id) return;
    await addHabitMutation({ variables: { user_id, title, frequency, start_date: today } });
    refetch();
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          Habits
        </Typography>
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Habit
        </Button>
      </Stack>
      <Stack spacing={2}>
        {habits.map((h) => {
          const done = h.habit_logs.some((log) => log.date === today && log.completed);
          return (
            <Card key={h.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{h.title}</Typography>
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
          );
        })}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Habit</DialogTitle>
        <DialogContent>
          <Stack mt={1} spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField
              select
              label="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
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
              addHabit(name.trim(), frequency);
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
