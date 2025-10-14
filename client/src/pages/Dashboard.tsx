import { Card, CardContent, Stack, Typography, Chip, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaidIcon from "@mui/icons-material/Paid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import dayjs from "dayjs";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_USER_DASHBOARD = gql`
  query GetUserDashboard($userId: uuid!) {
    habits(where: { user_id: { _eq: $userId } }) {
      id
      title
      habit_logs(where: { completed: { _eq: true } }) {
        date
      }
    }
    expenses(where: { user_id: { _eq: $userId } }) {
      id
      amount
      spent_at
    }
  }
`;

type HabitLog = {
  date: string;
};

type Habit = {
  id: string;
  title: string;
  habit_logs: HabitLog[];
};

type Expense = {
  id: string;
  amount: number;
  spent_at: string;
};

type DashboardData = {
  habits: Habit[];
  expenses: Expense[];
};

type DashboardProps = {
  userId: string;
};

export default function Dashboard({ userId }: DashboardProps) {
  const { data, loading, error } = useQuery<DashboardData>(GET_USER_DASHBOARD, {
    variables: { userId },
  });

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const habits = data?.habits ?? [];
  const expenses = data?.expenses ?? [];

  const today = dayjs().format("YYYY-MM-DD");
  const habitsDoneToday = habits.filter(h =>
    h.habit_logs.some(log => log.date === today)
  ).length;

  const last7 = [...Array(7)].map((_, i) => {
    const d = dayjs().subtract(6 - i, "day");
    const key = d.format("YYYY-MM-DD");

    const spent = expenses
      .filter(e => e.spent_at.slice(0, 10) === key)
      .reduce((a, b) => a + Number(b.amount), 0);

    const completed = habits.filter(h =>
      h.habit_logs.some(log => log.date === key)
    ).length;

    return { day: d.format("ddd"), spent: Number(spent.toFixed(2)), completed };
  });

  return (
    <Stack spacing={5}>
      <Typography variant="h4" fontWeight={800}>
        Hey, welcome back!
      </Typography>
      <Typography variant="h6" fontFamily="arial" color="text.secondary">
        Here's a summary of your habits and expenses.
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={3}>
        {/* Habits Today */}
        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 500 }}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Habits Today
                </Typography>
                <Chip icon={<CheckCircleIcon />} color="success" label={`${habitsDoneToday}`} />
              </Stack>
              <Typography variant="h3" sx={{ mt: 10, ml: 12 }}>
                {habitsDoneToday}/{habits.length}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 5, ml: 9 }}>
                Daily consistency
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 500 }}>
          <Card sx={{ p: 3, height: "100%", boxShadow: 4, borderRadius: 3 }}>
            <CardContent sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h6" sx={{ p: 2 }}>
                  Weekly Progress
                </Typography>
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
