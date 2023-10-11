import { createContext, useReducer, useContext } from "react";

const initialState = { watching: [], waiting: [], completed: [] };

export const RowsContext = createContext();
export const RowsDispatchContext = createContext();

export const RowReducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "LOAD":
      return { ...action.state };
    case "UPDATE":
      return { ...action.state };
    case "DESTROY":
      return { ...action.state };
    default:
      return state;
  }
};

export const RowProvider = ({ children }) => {
  const [rows, dispatch] = useReducer(RowReducer, initialState);

  return (
    <RowsContext.Provider value={rows}>
      <RowsDispatchContext.Provider value={dispatch}>
        {children}
      </RowsDispatchContext.Provider>
    </RowsContext.Provider>
  );
};

export const useRows = () => {
  return useContext(RowsContext);
};

export const useRowsDispatch = () => {
  return useContext(RowsDispatchContext);
};
