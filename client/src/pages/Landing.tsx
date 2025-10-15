import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import { useColorMode } from "../theme/ThemeProvider";
import { useUser, useClerk, SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Landing() {
  const { mode } = useColorMode();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <Box>
      {/* AppBar */}
      <AppBar elevation={0} position="sticky" color="transparent">
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            SmartLife
          </Typography>
          <Stack direction="row" spacing={1}>
            {isSignedIn ? (
              <Button color="primary" variant="contained" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <>
                <SignInButton mode="redirect">
                  <Button color="primary" variant="text">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <Button color="primary" variant="contained">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          background:
            mode === "light"
              ? "radial-gradient(1200px 600px at 10% -20%, rgba(108,92,231,0.15), transparent 60%), radial-gradient(1200px 600px at 100% -10%, rgba(0,209,255,0.12), transparent 50%)"
              : "radial-gradient(1200px 600px at 10% -20%, rgba(143,123,255,0.22), transparent 60%), radial-gradient(1200px 600px at 100% -10%, rgba(0,229,255,0.20), transparent 50%)",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h2">Master your habits, expenses, and goals</Typography>
            <Typography variant="h6" sx={{ maxWidth: 800 }}>
              SmartLife is your all‑in‑one personal operating system. Build habits that last, understand your spending,
              and make data‑driven decisions with beautiful insights.
            </Typography>
            {!isSignedIn && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
                <SignUpButton mode="redirect">
                  <Button size="large" variant="contained">
                    Sign Up
                  </Button>
                </SignUpButton>
                <SignInButton mode="redirect">
                  <Button size="large" variant="outlined">
                    Sign In
                  </Button>
                </SignInButton>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Feature Cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Smart Financial Intelligence
                  </Typography>
                </Stack>
                <Typography color="text.secondary" align="center">
                  SmartLife turns your data into real insight — from AI detecting that 30% of your money goes to coffee,
                  to predictive budgeting that shows where you're headed next
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Better Habits = Rewards
                  </Typography>
                </Stack>
                <Typography color="text.secondary">
                  Turn progress into motivation. SmartLife connects your habits with real-world impact — like saving
                  on healthcare when you hit your gym goals.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsightsIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Social & Community
                  </Typography>
                </Stack>
                <Typography color="text.secondary">
                  Join a community that thrives on progress — compare routines with friends, take part in weekly
                  challenges, and celebrate achievements together.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              SmartLife by Pahal Srivastava :D
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
