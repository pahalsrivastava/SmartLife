import { Box, Container, Typography, Alert } from '@mui/material';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  const hasClerkKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4" fontWeight={800} textAlign="center">
          Welcome back
        </Typography>
        {!hasClerkKey ? (
          <Alert severity="warning">
            Authentication is not configured. 
          </Alert>
        ) : (
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/dashboard" />
        )}
      </Box>
    </Container>
  );
}