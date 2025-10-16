import { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography, Box, CircularProgress } from "@mui/material";
import { useUser, useAuth } from "@clerk/clerk-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
interface Expense {
  category: { name: string } | null;
  amount: number;
  user_id: string;
}
export default function Reports() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchReports = async () => {
      if (!user || !isLoaded) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getToken({ template: "hasura" });
        const response = await fetch(
          "https://eager-grub-46.hasura.app/v1/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query: `
                query GetAllExpenses {
                  expenses {
                    amount
                    user_id
                    category {
                      name
                    }
                  }
                }
              `,
            }),
          }
        );
        const result = await response.json();
        if (result.errors) throw new Error(result.errors[0].message);
        const userExpenses = result.data.expenses.filter(
          (e: Expense) => e.user_id === user.id
        );
        setExpenses(userExpenses);
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, isLoaded, getToken]);

  if (loading)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
        <CircularProgress />
        <Typography mt={2}>Loading Reports...</Typography>
      </Stack>
    );

  if (error)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
        <Typography color="error">Error fetching reports: {error}</Typography>
      </Stack>
    );

  // Prepare chart data
  const chartData = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      const categoryName = e.category?.name || "Uncategorized";
      acc[categoryName] = (acc[categoryName] ?? 0) + Number(e.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

  const colors = ["#6C5CE7", "#00D1FF", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>
        Reports
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Card sx={{ p: 3, flex: 1, minWidth: 350, maxWidth: 500, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    innerRadius={70}
                  >
                    {chartData.map((_, i) => (
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
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography color="text.secondary">
              Categories: {chartData.length} • Total entries: {expenses.length}
            </Typography>
            <Typography fontWeight={600}>
              Total Spent: ₹{expenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}
