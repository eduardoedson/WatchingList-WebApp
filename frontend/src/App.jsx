import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScrollUp from "./components/ScrollUp";
import AppBar from "./components/AppBar";
import { Box } from "@mui/material";
import { FormProvider } from "./context/FormContext";
import { RowProvider } from "./context/RowContext";
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  const darkTheme = createTheme({ palette: { mode: "dark" } });

  return (
    <Box className="App">
      <ThemeProvider theme={darkTheme}>
        <LoadingProvider>
          <RowProvider>
            <FormProvider>
              <AppBar />
              <ScrollUp />
            </FormProvider>
          </RowProvider>
        </LoadingProvider>
      </ThemeProvider>
    </Box>
  );
}

export default App;
