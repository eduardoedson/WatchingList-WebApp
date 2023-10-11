import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useState } from "react";
import { useFormDispatch } from "../context/FormContext";
import { useLoading, useLoadingDispatch } from "../context/LoadingContext";
import Table from "./Table";

function App() {
  const formDispatch = useFormDispatch();
  const loadingDispatch = useLoadingDispatch();
  const { loading } = useLoading();

  const [value, setValue] = useState("Anime");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    formDispatch({ type: "RESET" });
    loadingDispatch({ type: "START" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Box>
      <Box>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <DevicesRoundedIcon />
            </IconButton>
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab disabled={loading} label="Animes" value="Anime" />
              <Tab disabled={loading} label="Séries" value="Serie" />
              <Tab disabled={loading} label="Mangás" value="Manga" />
            </Tabs>
          </Toolbar>
        </AppBar>
      </Box>
      <Box className="Main-Content-Container">
        <Paper elevation={6}>
          <Table category={value} />
        </Paper>
      </Box>
    </Box>
  );
}

export default App;
