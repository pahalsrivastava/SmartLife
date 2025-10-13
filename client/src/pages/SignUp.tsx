import { Box, Container, Typography, Alert } from '@mui/material';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  const hasClerkKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4" fontWeight={800} textAlign="center">
          Create your account
        </Typography>
        {!hasClerkKey ? (
          <Alert severity="warning">
            Authentication is not configured. Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your environment.
          </Alert>
        ) : (
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/dashboard" />
        )}
      </Box>
    </Container>
  );
}
