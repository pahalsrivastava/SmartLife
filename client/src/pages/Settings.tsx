import { Stack, Typography, Button } from '@mui/material';
import { useColorMode } from '../theme/ThemeProvider';

export default function Settings() {
  const { mode, toggle } = useColorMode();
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Settings</Typography>
      <Typography>Theme mode: {mode}</Typography>
      <Button onClick={toggle}>Toggle Theme</Button>
    </Stack>
  );
}