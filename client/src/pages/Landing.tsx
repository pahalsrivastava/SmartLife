import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from '../theme/ThemeProvider';

export default function Landing() {
  const { mode } = useColorMode();

  return (
    <Box>
      {/* Top Nav */}
      <AppBar elevation={0} position="sticky" color="transparent">
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            SmartLife
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/sign-in" color="primary" variant="text">
              Sign in
            </Button>
            <Button component={RouterLink} to="/sign-up" color="primary" variant="contained">
              Get started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          background:
            mode === 'light'
              ? 'radial-gradient(1200px 600px at 10% -20%, rgba(108,92,231,0.15), transparent 60%), radial-gradient(1200px 600px at 100% -10%, rgba(0,209,255,0.12), transparent 50%)'
              : 'radial-gradient(1200px 600px at 10% -20%, rgba(143,123,255,0.22), transparent 60%), radial-gradient(1200px 600px at 100% -10%, rgba(0,229,255,0.20), transparent 50%)',
        }}>
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip label="Track Today, Thrive Tomorrow" color="primary" variant="outlined" />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
              Master your habits, expenses, and goals
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800 }}>
              SmartLife is your all‑in‑one personal operating system. Build habits that last, understand your spending, and make data‑driven decisions with beautiful insights.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              <Button size="large" component={RouterLink} to="/sign-up" variant="contained">
                Get started — it’s free
              </Button>
              <Button size="large" component={RouterLink} to="/sign-in" variant="outlined">
                I already have an account
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Feature grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>Habit Tracking</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Build streaks, visualize progress, and stay consistent with flexible schedules and reminders.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>Expense Tracking</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Categorize spending, set budgets, and spot trends so your money works for you.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsightsIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>Beautiful Reports</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Get actionable insights with clean charts and reports that highlight what matters.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Secondary CTA */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Card sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Typography variant="h4" fontWeight={800}>
                  Ready to design your best days?
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
                  Join SmartLife and turn small daily actions into big long‑term results.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button size="large" component={RouterLink} to="/sign-up" variant="contained">
                    Create your account
                  </Button>
                  <Button size="large" component={RouterLink} to="/sign-in" variant="outlined">
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} SmartLife</Typography>
            <Stack direction="row" spacing={2}>
              <Chip label="Habit" size="small" />
              <Chip label="Expense" size="small" />
              <Chip label="Reports" size="small" />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
