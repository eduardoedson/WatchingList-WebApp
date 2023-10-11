import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fab from "@mui/material/Fab";
import { useState } from "react";

export default function ScrollUp() {
  const [upBtnVisible, setUpBtnVisible] = useState("none");

  const toggleBtnVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 20) {
      setUpBtnVisible("inline-flex");
    } else if (scrolled <= 20) {
      setUpBtnVisible("none");
    }
  };

  window.addEventListener("scroll", toggleBtnVisible);

  return (
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
  );
}
