import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DangerousRoundedIcon from "@mui/icons-material/DangerousRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import Tooltip from "@mui/material/Tooltip";
import { blue, cyan, green, lime, red } from "@mui/material/colors";
import { useFormDispatch } from "../context/FormContext";
import { useLoading, useLoadingDispatch } from "../context/LoadingContext";
import { useRowsDispatch } from "../context/RowContext";
import { destroyItem, updateItem } from "../services/backend";
import { backToTop } from "../services/globals";

export default function Buttons({ row }) {
  const rowsDispatch = useRowsDispatch();
  const formDispatch = useFormDispatch();
  const loadingDispatch = useLoadingDispatch();
  const { loading } = useLoading();

  const editBtn = async (id, body) => {
    loadingDispatch({ type: "START" });
    formDispatch({ state: { id }, type: "UPDATE" });

    const rows = await updateItem(id, { ...body, category: row.category });
    rowsDispatch({
      state: rows,
      type: "UPDATE",
    });
    loadingDispatch({ type: "STOP" });
  };

  const activeEditForm = (row) => {
    backToTop();
    const state = {
      id: row.id,
      name: row.name,
      season: row.season,
      current: row.current,
      link: row.link,
      imgLink: row.img_link,
      status: row.type,
      formVisible: true,
    };

    if (row.category === "Manga") {
      delete state["season"];
    }

    formDispatch({ state, type: "UPDATE" });
  };

  const callDestroy = async (row) => {
    loadingDispatch({ type: "START" });
    const rows = await destroyItem(row.id, row.category);
    if (rows) {
      rowsDispatch({
        state: rows,
        type: "UPDATE",
      });
    }
    loadingDispatch({ type: "STOP" });
  };

  const defaultActions = () => {
    return (
      <>
        <Tooltip title="Editar">
          <EditRoundedIcon
            sx={{ color: blue[900], fontSize: 25 }}
            disabled={loading}
            onClick={() => activeEditForm(row)}
          />
        </Tooltip>
        <Tooltip title="Apagar">
          <DeleteRoundedIcon
            sx={{ color: red[500], fontSize: 25 }}
            disabled={loading}
            onClick={() => callDestroy(row)}
          />
        </Tooltip>
      </>
    );
  };

  const actionButtons = () => {
    if (row.type === "watching") {
      return (
        <>
          <Tooltip
            title={`Avançar ${
              row.category === "Manga" ? "Capítulo" : "Episódio"
            }`}
          >
            <SkipNextRoundedIcon
              sx={{ color: cyan[200], fontSize: 25 }}
              disabled={loading}
              onClick={() =>
                editBtn(row.id, { current: +row.current + 1 }, row.category)
              }
            />
          </Tooltip>
          {row.category !== "Manga" && (
            <Tooltip title="Marcar como Waiting">
              <PauseCircleOutlineRoundedIcon
                sx={{ color: lime["A100"], fontSize: 25 }}
                disabled={loading}
                onClick={() => editBtn(row.id, { waiting: true }, row.category)}
              />
            </Tooltip>
          )}
          <Tooltip title="Marcar como Completed">
            <CheckCircleOutlineRoundedIcon
              sx={{ color: green["A200"], fontSize: 25 }}
              disabled={loading}
              onClick={() => editBtn(row.id, { completed: true }, row.category)}
            />
          </Tooltip>
          {defaultActions()}
        </>
      );
    } else if (row.type === "waiting") {
      return (
        <>
          <Tooltip title="Marcar como Ongoing">
            <PlayCircleOutlineRoundedIcon
              sx={{ color: lime["A100"], fontSize: 25 }}
              disabled={loading}
              onClick={() => editBtn(row.id, { waiting: false }, row.category)}
            />
          </Tooltip>
          <Tooltip title="Marcar como Completed">
            <CheckCircleOutlineRoundedIcon
              sx={{ color: green["A200"], fontSize: 25 }}
              disabled={loading}
              onClick={() => editBtn(row.id, { completed: true }, row.category)}
            />
          </Tooltip>
          {defaultActions(row)}
        </>
      );
    } else if (row.type === "completed") {
      return (
        <>
          <Tooltip title="Marcar como Ongoing">
            <DangerousRoundedIcon
              sx={{ color: green["A200"], fontSize: 25 }}
              disabled={loading}
              onClick={() =>
                editBtn(row.id, { completed: false }, row.category)
              }
            />
          </Tooltip>
          {defaultActions()}
        </>
      );
    }
  };

  return actionButtons();
}
