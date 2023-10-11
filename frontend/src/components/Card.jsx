import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { formatDate, leftPad } from "../services/globals";
import Buttons from "./Buttons";

export default function CardFunc({ row }) {
  const chipColorAndLabel = {
    watching: { label: "Ongoing", color: "secondary" },
    waiting: { label: "Waiting", color: "warning" },
    completed: { label: "Completed", color: "success" },
  };

  return (
    <Paper elevation={12} className="Card-Container">
      <Box className="Card-Left-Container">
        <img src={row.img_link} alt={"Thumbnail " + row.name} loading="lazy" />
      </Box>
      <Box className="Card-Right-Container">
        <span className="Card-Title">
          <Link href={row.link} target="_blank" underline="none">
            {row.name} <OpenInNewIcon />
          </Link>
        </span>
        <span className="Card-Desc">
          {row.category !== "Manga"
            ? `${leftPad(row.season, 2)}x${leftPad(row.current, 2)}`
            : `Capítulo: ${row.current}`}
        </span>

        <div className="Card-Btns-Container">
          <Buttons row={row} />
          <Stack className="Card-Type">
            <Chip
              color={chipColorAndLabel[row.type].color}
              disabled={false}
              size="medium"
              variant="elevated"
              label={chipColorAndLabel[row.type].label}
              className="Status-Label"
            />
          </Stack>
        </div>
      </Box>
    </Paper>
  );
}
