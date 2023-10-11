import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useForm, useFormDispatch } from "../context/FormContext";
import { useLoading, useLoadingDispatch } from "../context/LoadingContext";
import { useRowsDispatch } from "../context/RowContext";
import { storeItem, updateItem } from "../services/backend";
import { backToItem } from "../services/globals";

export default function Form({ category }) {
  const context = useForm();
  const formDispatch = useFormDispatch();
  const rowsDispatch = useRowsDispatch();
  const loadingDispatch = useLoadingDispatch();
  const { loading } = useLoading();

  const id = context.id ? context.id : null;
  const [name, setName] = useState("");
  const [season, setSeason] = useState(1);
  const [current, setCurrent] = useState(1);
  const [link, setLink] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [status, setStatus] = useState("");

  const [nameError, setNameError] = useState("");
  const [seasonError, setSeasonError] = useState("");
  const [currentError, setCurrentError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [imgLinkError, setImgLinkError] = useState("");
  const [formFeedback, setFormfeedback] = useState("");

  const waiting = {
    Ongoing: false,
    Waiting: true,
    Completed: false,
  };

  const completed = {
    Ongoing: false,
    Waiting: false,
    Completed: true,
  };

  const validateFields = () => {
    const regexNumber = /^[0-9]\d*$/;
    const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;

    if (name) {
      setNameError("");
    } else {
      setNameError("Nome inválido");
      return false;
    }

    if (!regexNumber.test(season) && category !== "Manga") {
      setSeasonError("Temporada inválida");
      return false;
    } else {
      setSeasonError("");
    }

    if (!regexNumber.test(current)) {
      setCurrentError("Episódio inválido");
      return false;
    } else {
      setCurrentError("");
    }

    if (!regexUrl.test(link)) {
      setLinkError("Link inválido");
      return false;
    } else {
      setLinkError("");
    }

    if (!regexUrl.test(imgLink)) {
      setImgLinkError("Link inválido");
      return false;
    } else {
      setImgLinkError("");
    }

    return true;
  };

  const formBtnClick = async () => {
    const body = {
      name,
      current,
      link,
      imgLink,
      season,
      waiting: waiting[status],
      completed: completed[status],
      category,
    };

    if (category === "Manga") {
      delete body["season"];
    }

    let rows = null;

    if (validateFields()) {
      loadingDispatch({ type: "START" });

      if (id) {
        rows = await updateItem(id, body, setFormfeedback);
      } else {
        rows = await storeItem(body, setFormfeedback);
      }

      if (rows) {
        rowsDispatch({
          state: rows,
          type: "UPDATE",
        });
      }
    }

    loadingDispatch({ type: "STOP" });
  };

  useEffect(() => {
    if (!loading) {
      if (id) {
        backToItem(id);
      }
      formDispatch({ type: "RESET" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const status = {
      watching: "Ongoing",
      waiting: "Waiting",
      completed: "Completed",
    };

    setName(context.name);
    setSeason(context.season);
    setCurrent(context.current);
    setLink(context.link);
    setImgLink(context.imgLink);
    setStatus(status[context.status] ? status[context.status] : context.status);
    setFormfeedback(null);
  }, [context]);

  return (
    <Box className="Form-Container">
      <Button
        color="secondary"
        variant="outlined"
        size="medium"
        disabled={loading}
        startIcon={
          context.formVisible ? <RemoveRoundedIcon /> : <AddRoundedIcon />
        }
        onClick={() => formDispatch({ type: "TOOGLE_MENU" })}
      >
        {`Nov${category === "Serie" ? "a" : "o"} ${category}`}
      </Button>

      {context.formVisible && (
        <Box>
          {formFeedback && (
            <Alert className="Form-Alert" severity={formFeedback.type}>
              {formFeedback.msg}
            </Alert>
          )}
          <Box className="Form-Container-Inputs">
            {id && (
              <TextField
                id="id"
                label="ID"
                size="small"
                disabled
                value={id}
                width={30}
              />
            )}

            <TextField
              id="name"
              label="Nome"
              size="small"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              error={nameError.length > 0}
              helperText={nameError}
            />

            {category !== "Manga" && (
              <TextField
                id="season"
                label="Temporada"
                size="small"
                required
                type="number"
                value={season}
                onChange={(event) => {
                  setSeason(event.target.value);
                }}
                error={seasonError.length > 0}
                helperText={seasonError}
              />
            )}

            <TextField
              id="current"
              label={category === "Manga" ? "Capítulo" : "Episódio"}
              size="small"
              required
              type="number"
              value={current}
              onChange={(event) => {
                setCurrent(event.target.value);
              }}
              error={currentError.length > 0}
              helperText={currentError}
            />

            <TextField
              id="link"
              label="Link"
              size="small"
              required
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
              }}
              type="url"
              error={linkError.length > 0}
              helperText={linkError}
            />

            <TextField
              id="img-link"
              label="Link Imagem"
              required
              size="small"
              value={imgLink}
              onChange={(event) => {
                setImgLink(event.target.value);
              }}
              type="url"
              error={imgLinkError.length > 0}
              helperText={imgLinkError}
            />

            <FormControl size="small">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Status"
                autoWidth
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                {category !== "Manga" && (
                  <MenuItem value="Waiting">Waiting</MenuItem>
                )}
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="Form-Container-Btns">
            <Button
              variant="contained"
              color="error"
              startIcon={<ClearRoundedIcon />}
              disabled={loading}
              onClick={() => formDispatch({ type: "CANCEL_FORM" })}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="success"
              startIcon={<SaveRoundedIcon />}
              disabled={loading}
              onClick={formBtnClick}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
