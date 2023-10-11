import { createContext, useReducer, useContext } from "react";

const initialState = {
  loading: false,
};

export const LoadingContext = createContext();
export const LoadingDispatchContext = createContext();

export const LoadingReducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...state, loading: true };
    case "STOP":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const LoadingProvider = ({ children }) => {
  const [loading, dispatch] = useReducer(LoadingReducer, initialState);

  return (
    <LoadingContext.Provider value={loading}>
      <LoadingDispatchContext.Provider value={dispatch}>
        {children}
      </LoadingDispatchContext.Provider>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const useLoadingDispatch = () => {
  return useContext(LoadingDispatchContext);
};
