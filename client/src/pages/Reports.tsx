import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import { useExpenseStore } from '../stores/expenses';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function Reports() {
  const { expenses } = useExpenseStore();
  const byCategory = Object.values(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {})
  );

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{p:3, minWidth:350, maxWidth:500, height:"100%",boxShadow:4, borderRadius:3}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Spending by Category</Typography>
              <div style={{ width: '100%', height: 320 }}>
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
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{p:3, minWidth:350, maxWidth:500, height:"100%",boxShadow:4, borderRadius:3}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography color="text.secondary">
                Categories: {data.length} • Total entries: {byCategory.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}