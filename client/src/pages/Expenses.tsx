import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography, CircularProgress,MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const GET_USER_EXPENSES = gql`
  query GetUserExpenses($clerk_id: String!) {
    users(where: { clerk_id: { _eq: $clerk_id } }) {
      id
      expenses {
        id
        description
        amount
        spent_at
        category {
          id
          name
        }
      }
    }
    categories(order_by: { name: asc }) {
      id
      name
    }
  }
`;
const ADD_EXPENSE = gql`
  mutation AddExpense(
    $user_id: uuid!
    $description: String!
    $amount: numeric!
    $spent_at: timestamp!
    $category_id: uuid
  ) {
    insert_expenses_one(
      object: {
        user_id: $user_id
        description: $description
        amount: $amount
        spent_at: $spent_at
        category_id: $category_id
      }
    ) {
      id
      description
      amount
      spent_at
      category {
        id
        name
      }
    }
  }
`;
const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: uuid!) {
    delete_expenses_by_pk(id: $id) {
      id
    }
  }
`;

interface Category {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: string;
  spent_at: string;
  category: Category | null;
}

export default function Expenses() {
  const { isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  if (!isLoaded) return <CircularProgress />;
  if (!user) return <Typography>User not found</Typography>;

  const { data, loading, error, refetch } = useQuery<
    { users: { id: string; expenses: Expense[] }[]; categories: Category[] },
    { clerk_id: string }
  >(GET_USER_EXPENSES, {
    variables: { clerk_id: user.id },
  });

  const [addExpenseMutation] = useMutation(ADD_EXPENSE);
  const [deleteExpenseMutation] = useMutation(DELETE_EXPENSE);

  const user_id = data?.users?.[0]?.id || '';
  const expenses: Expense[] = data?.users?.[0]?.expenses || [];
  const categories: Category[] = data?.categories || [];

  const addExpense = async () => {
    if (!user_id) return;
    const parsed = Number(amount);
    if (!description.trim() || Number.isNaN(parsed)) return;

    await addExpenseMutation({
      variables: {
        user_id,
        description: description.trim(),
        amount: parsed,
        spent_at: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        category_id: categoryId || null,
      },
    });
    await refetch();
    setDescription('');
    setAmount('');
    setCategoryId('');
    setOpen(false);
  };
  const deleteExpense = async (id: string) => {
    await deleteExpenseMutation({ variables: { id } });
    await refetch();
  };
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading expenses</Typography>;
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          Expenses
        </Typography>
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Expense
        </Button>
      </Stack>
      <Stack spacing={2}>
        {expenses.length === 0 && <Typography>No expenses yet. Add one!</Typography>}
        {expenses.map((e) => (
          <Card key={e.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{e.description}</Typography>
                  <Typography color="text.secondary">
                    {e.category?.name || 'General'} • {dayjs(e.spent_at).format('MMM D, YYYY')}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">${Number(e.amount).toFixed(2)}</Typography>
                  <IconButton color="error" onClick={() => deleteExpense(e.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack> 
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Stack mt={1} spacing={2}>
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">General</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addExpense}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
