import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import Anime from "./components/Anime";
import Serie from "./components/Serie";
import Manga from "./components/Manga";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function App() {
  const darkTheme = createTheme({ palette: { mode: "dark" } });
  const [value, setValue] = useState("Anime");
  const [upBtnVisible, setUpBtnVisible] = useState("none");

  const toggleBtnVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 20) {
      setUpBtnVisible("inline-flex");
    } else if (scrolled <= 20) {
      setUpBtnVisible("none");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  window.addEventListener("scroll", toggleBtnVisible);

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Animes" value="Anime" />
            <Tab label="Séries" value="Serie" />
            <Tab label="Mangás" value="Manga" />
          </Tabs>
        </AppBar>

        <div className="App-tab-content">{value === "Anime" && <Anime />}</div>
        <div className="App-tab-content">{value === "Serie" && <Serie />}</div>
        <div className="App-tab-content">{value === "Manga" && <Manga />}</div>

        <Fab
          color="secondary"
          size="small"
          className="up-btn"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          style={{ display: upBtnVisible }}
        >
          <ArrowUpwardIcon fontSize="medium" />
        </Fab>
      </ThemeProvider>
    </div>
  );
}

export default App;
