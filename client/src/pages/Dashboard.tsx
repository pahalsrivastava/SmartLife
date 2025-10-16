import { Card, CardContent, Stack, Typography, Chip, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaidIcon from "@mui/icons-material/Paid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import dayjs from "dayjs";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useUser } from "@clerk/clerk-react";

type Habit = { id: string; title: string; start_date: string };
type HabitLog = { id: string; habit_id: string; date: string; completed: boolean };
type Expense = { id: string; amount: number; spent_at: string };
type UserData = { habits: Habit[]; habit_logs: HabitLog[]; expenses: Expense[] };
type QueryResult = { users: UserData[] };
const GET_USER_DATA = gql`
  query GetUserData($clerkId: String!) {
    users(where: { clerk_id: { _eq: $clerkId } }) {
      habits { id title start_date }
      habit_logs { id habit_id date completed }
      expenses { id amount spent_at }
    }
  }
`;
export default function Dashboard({ clerkId }: { clerkId: string }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { data, loading, error } = useQuery<QueryResult>(GET_USER_DATA, { variables: { clerkId } });

  if (!isLoaded || loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data?.users[0];
  if (!user) return <p>No data found for this user.</p>;

  const habits = user.habits ?? [];
  const habitLogs = user.habit_logs ?? [];
  const expenses = user.expenses ?? [];
  const today = dayjs().format("YYYY-MM-DD");

  const habitsDoneToday = habitLogs.filter(h => h.completed && h.date === today).length;

  const last7 = [...Array(7)].map((_, i) => {
    const d = dayjs().subtract(6 - i, "day");
    const key = d.format("YYYY-MM-DD");
    const completed = habitLogs.filter(h => h.completed && h.date === key).length;
    const spent = expenses
      .filter(e => e.spent_at.slice(0, 10) === key)
      .reduce((acc, e) => acc + Number(e.amount), 0);
    return { day: d.format("ddd"), completed, spent: Number(spent.toFixed(2)) };
  });

  return (
    <Stack spacing={5}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {clerkUser?.firstName
            ? `Hi, ${clerkUser?.firstName}!`
            : clerkUser?.username
            ? `Hi, ${clerkUser?.username}!`
            : "Hi, User!"}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={800}>
        Here's a summary of your habits and expenses
      </Typography>
      <Stack direction="row" flexWrap="wrap" spacing={3}>
        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 500 }}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Habits Today</Typography>
                <Chip icon={<CheckCircleIcon />} color="success" label={`${habitsDoneToday}`} />
              </Stack>
              <Typography variant="h3" sx={{ mt: 10, ml: 12 }}>{habitsDoneToday}/{habits.length}</Typography>
              <Typography color="text.secondary" sx={{ mt: 5, ml: 9 }}>Daily consistency</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 500 }}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 4, borderRadius: 3 }}>
            <CardContent sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ p: 2 }}>Weekly Progress</Typography>
                <Chip icon={<TrendingUpIcon />} color="primary" label="Last 7 days" sx={{ fontSize: "0.9rem", px: 1 }} />
              </Stack>
              <BoxChartArea data={last7} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 500 }}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h6">Spending (7d)</Typography>
                <Chip icon={<PaidIcon />} color="secondary" label="USD" />
              </Stack>
              <BoxChartBar data={last7} />
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Stack>
  );
}

function BoxChartArea({ data }: { data: { day: string; completed: number }[] }) {
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="completed" stroke="#6C5CE7" fill="url(#completed)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BoxChartBar({ data }: { data: { day: string; spent: number }[] }) {
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spent" fill="#00D1FF" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
