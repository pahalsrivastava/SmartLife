import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { useExpenseStore } from '../stores/expenses';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function Reports() {
  const { expenses } = useExpenseStore();

  const data = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {})
  ).map(([k, v]) => ({ name: k, value: Number(v.toFixed(2)) }));

  const colors = ['#6C5CE7', '#00D1FF', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Reports</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ p: 3, flex: 1, minWidth: 350, maxWidth: 500, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Spending by Category</Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} innerRadius={70}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ p: 3, flex: 1, minWidth: 350, maxWidth: 500, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Typography color="text.secondary">
              Categories: {data.length} • Total entries: {expenses.length}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
