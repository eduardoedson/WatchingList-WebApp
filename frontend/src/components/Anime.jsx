import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DangerousRoundedIcon from "@mui/icons-material/DangerousRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import { Alert } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { blue, cyan, green, lime, red } from "@mui/material/colors";
import { useEffect, useState } from "react";
import Api from "../services/backend.js";
import Loading from "./Loading";

export default function Anime() {
  const category = "Anime";
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [season, setSeason] = useState(1);
  const [current, setCurrent] = useState(1);
  const [link, setLink] = useState("https://");
  const [status, setStatus] = useState("Assistindo");

  const [nameError, setNameError] = useState("");
  const [seasonError, setSeasonError] = useState("");
  const [currentError, setCurrentError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [rowsWatching, setRowsWatching] = useState([]);
  const [rowsWaiting, setRowsWaiting] = useState([]);
  const [rowsCompleted, setRowsCompleted] = useState([]);

  const waiting = {
    Assistindo: false,
    Esperando: true,
    Completo: false,
  };

  const completed = {
    Assistindo: false,
    Esperando: false,
    Completo: true,
  };

  const resetFields = () => {
    setId("");
    setName("");
    setSeason(1);
    setCurrent(1);
    setLink("https://");
    setStatus("Assistindo");
    setSubmitError("");
    setFormVisible(false);
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

    if (!regexNumber.test(season)) {
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

    return true;
  };

  const getWatching = async () => {
    await Api.get(`/get/${category}/false/false`).then((response) =>
      setRowsWatching(response.data.items)
    );
  };

  const getWaiting = async () => {
    await Api.get(`/get/${category}/true/false`).then((response) =>
      setRowsWaiting(response.data.items)
    );
  };

  const getCompleted = async () => {
    await Api.get(`/get/${category}/false/true`).then((response) =>
      setRowsCompleted(response.data.items)
    );
  };

  const getItems = async () => {
    setLoading(true);

    resetFields();
    await getWatching();
    await getWaiting();
    await getCompleted();

    setLoading(false);
  };

  const storeItem = async () => {
    if (validateFields()) {
      setLoading(true);
      await Api.post("/store", {
        name,
        season,
        current,
        link,
        category,
        waiting: waiting[status],
        completed: completed[status],
      })
        .then(() => getItems())
        .catch((response) => {
          setSubmitError(response.message);
          console.log("Store Error === ", response);
        });
      setLoading(false);
    }
  };

  const updateItem = async (id, body) => {
    setLoading(true);
    await Api.put(`/update/${id}`, body)
      .then(() => getItems())
      .catch((response) => {
        setSubmitError(response.message);
        console.log("Update Error === ", response);
      });
    setLoading(false);
  };

  const destroyItem = async (id) => {
    setLoading(true);
    await Api.delete(`/destroy/${id}`)
      .then(() => getItems())
      .catch((response) => {
        setSubmitError(response.message);
        console.log("Destroy error === ", response);
      });
    setLoading(false);
  };

  const formBtnClick = () => {
    if (id) {
      updateItem(id, {
        name,
        season,
        current,
        link,
        waiting: waiting[status],
        completed: completed[status],
      });
    } else {
      storeItem();
    }
  };

  const activeEdit = (row) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (!row.waiting && !row.completed) {
      setStatus("Assistindo");
    } else if (row.waiting) {
      setStatus("Esperando");
    } else if (row.completed) {
      setStatus("Completo");
    }

    setId(row.id);
    setName(row.name);
    setSeason(row.season);
    setCurrent(row.current);
    setLink(row.link);
    setFormVisible(true);
  };

  const defaultActions = (row) => {
    return (
      <>
        <Tooltip title="Editar">
          <EditRoundedIcon
            sx={{ color: blue[900] }}
            onClick={() => activeEdit(row)}
          />
        </Tooltip>
        <Tooltip title="Apagar">
          <DeleteRoundedIcon
            sx={{ color: red[500] }}
            onClick={() => destroyItem(row.id)}
          />
        </Tooltip>
      </>
    );
  };

  const actionButtons = (row, type) => {
    if (type === "watching") {
      return (
        <>
          <Tooltip title="Avançar um episódio">
            <SkipNextRoundedIcon
              sx={{ color: cyan[200] }}
              onClick={() => updateItem(row.id, { current: +row.current + 1 })}
            />
          </Tooltip>
          <Tooltip title="Marcar como esperando proximá temporada">
            <PauseCircleOutlineRoundedIcon
              sx={{ color: lime["A100"] }}
              onClick={() => updateItem(row.id, { waiting: true })}
            />
          </Tooltip>
          <Tooltip title="Marcar como completo">
            <CheckCircleOutlineRoundedIcon
              sx={{ color: green["A200"] }}
              onClick={() => updateItem(row.id, { completed: true })}
            />
          </Tooltip>
          {defaultActions(row)}
        </>
      );
    } else if (type === "waiting") {
      return (
        <>
          <Tooltip title="Marcar como assistindo novamente">
            <PlayCircleOutlineRoundedIcon
              sx={{ color: lime["A100"] }}
              onClick={() => updateItem(row.id, { waiting: false })}
            />
          </Tooltip>
          <Tooltip title="Marcar como completo">
            <CheckCircleOutlineRoundedIcon
              sx={{ color: green["A200"] }}
              onClick={() => updateItem(row.id, { completed: true })}
            />
          </Tooltip>
          {defaultActions(row)}
        </>
      );
    } else if (type === "completed") {
      return (
        <>
          <Tooltip title="Marcar como assistindo novamente">
            <DangerousRoundedIcon
              sx={{ color: green["A200"] }}
              onClick={() => updateItem(row.id, { completed: false })}
            />
          </Tooltip>
          {defaultActions(row)}
        </>
      );
    }
  };

  const tableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell align="right">Temporada</TableCell>
          <TableCell align="right">Episódio</TableCell>
          <TableCell>Link</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const tableBody = (rows, type) => {
    return (
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} hover>
            <TableCell>{row.name}</TableCell>
            <TableCell align="right">{row.season}</TableCell>
            <TableCell align="right">{row.current}</TableCell>
            <TableCell>
              <a href={row.link} target="_blank" rel="noreferrer">
                {row.link}
              </a>
            </TableCell>
            <TableCell className="container-tablecell-action">
              {actionButtons(row, type)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const table = (rows, type) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          {tableHeader()}
          {tableBody(rows, type)}
        </Table>
      </TableContainer>
    );
  };

  const form = () => {
    return (
      <>
        {formVisible && (
          <div className="container-form">
            <div className="form-alert">
              {submitError && <Alert severity="error">{submitError}</Alert>}
            </div>
            <div className="form-inputs">
              <TextField id="id" label="ID" size="small" disabled value={id} />

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

              <TextField
                id="current"
                label="Episódio"
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
                  <MenuItem value="Assistindo">Assistindo</MenuItem>
                  <MenuItem value="Esperando">Esperando</MenuItem>
                  <MenuItem value="Completo">Completo</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="form-btns">
              <Button
                variant="contained"
                color="error"
                startIcon={<ClearRoundedIcon />}
                onClick={() => setFormVisible(false)}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<SaveRoundedIcon />}
                onClick={formBtnClick}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (!formVisible) {
      resetFields();
    }
  }, [formVisible]);

  if (loading) return <Loading />;

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        startIcon={<AddRoundedIcon />}
        onClick={() => setFormVisible(true)}
      >
        Novo Anime
      </Button>

      {form()}

      <Divider light>
        <Chip label="Assistindo" />
      </Divider>
      <div className="container-watching">
        {table(rowsWatching, "watching")}
      </div>

      <Divider>
        <Chip label="Esperando" />
      </Divider>
      <div className="container-waiting">{table(rowsWaiting, "waiting")}</div>

      <Divider>
        <Chip label="Assistido" />
      </Divider>
      <div className="container-completed">
        {table(rowsCompleted, "completed")}
      </div>
    </div>
  );
}
