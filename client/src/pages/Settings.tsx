import { Stack, Typography, Button } from '@mui/material';
import { useColorMode } from '../theme/ThemeProvider';
import { SignOutButton } from '@clerk/clerk-react';

export default function Settings() {
  const { mode, toggle } = useColorMode();

  return (
    <Stack spacing={2} sx={{ p: 4, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight={800}>
        Settings
      </Typography>

      <Typography>Theme mode: {mode}</Typography>
      <Button variant="contained" onClick={toggle}>
        Toggle Theme
      </Button>

      <SignOutButton>
        <Button variant="contained" color="error">
          Logout
        </Button>
      </SignOutButton>
    </Stack>
  );
}
