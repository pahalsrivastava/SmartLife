import { useState } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { useExpenseStore } from '../stores/expenses';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useExpenseStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('');

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>Expenses</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Expense
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {expenses.map((e) => (
          <Grid item xs={12} md={6} lg={4} key={e.id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <Typography variant="h6">{e.name}</Typography>
                    <Typography color="text.secondary">{e.category} • {new Date(e.date).toDateString()}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6">${e.amount.toFixed(2)}</Typography>
                    <IconButton color="error" onClick={() => deleteExpense(e.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Stack mt={1} spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const parsed = Number(amount);
              if (!name.trim() || Number.isNaN(parsed)) return;
              addExpense({
                name: name.trim(),
                amount: parsed,
                category: category.trim() || 'General',
                date: dayjs().toISOString(),
              });
              setName('');
              setAmount('');
              setCategory('');
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