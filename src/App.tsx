import { CssBaseline } from '@mui/material';
import { Home } from './page/Home';
import { CustomThemeProvider } from './context';

export function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Home />
    </CustomThemeProvider>
  );
}