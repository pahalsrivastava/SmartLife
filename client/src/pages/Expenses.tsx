import React from 'react';
import { Stack, Typography, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExpenseStore } from '../stores/expenses';

const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense } = useExpenseStore();

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          Expenses
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {expenses.map((e) => (
          <Card key={e.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Typography variant="h6">{e.name}</Typography>
                  <Typography color="text.secondary">
                    {e.category} • {new Date(e.date).toDateString()}
                  </Typography>
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
        ))}
      </Stack>
    </Stack>
  );
};

export default ExpensesPage;
