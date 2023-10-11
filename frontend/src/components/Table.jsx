import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useLoading, useLoadingDispatch } from "../context/LoadingContext";
import { useRows, useRowsDispatch } from "../context/RowContext";
import { getItems } from "../services/backend";
import { rowKeys } from "../services/globals";
import CardFunc from "./Card";
import Form from "./Form";
import Loading from "./Loading";

export default function Table({ category }) {
  const rows = useRows();
  const rowDispatch = useRowsDispatch();
  const loadingDispatch = useLoadingDispatch();
  const { loading } = useLoading();

  const getRows = async (category) => {
    const { watching, waiting, completed } = await getItems(category);
    rowDispatch({
      state: { watching, waiting, completed },
      type: "LOAD",
    });
    loadingDispatch({ type: "STOP" });
  };

  useEffect(() => {
    getRows(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <Box>
      <Form category={category} />

      {loading ? (
        <Loading />
      ) : (
        <Box className="Tables-Container">
          {rowKeys.map(
            (key) =>
              rows.hasOwnProperty(key) &&
              rows[key].length > 0 && (
                <Paper elevation={3} className="Cards-Container" key={key}>
                  {rows[key].map((row) => (
                    <CardFunc key={row.id} row={{ ...row, type: key }} />
                  ))}
                </Paper>
              )
          )}
        </Box>
      )}
    </Box>
  );
}
