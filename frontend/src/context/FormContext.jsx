import { createContext, useReducer, useContext } from "react";

const initialState = {
  id: "",
  name: "",
  season: 1,
  current: 1,
  link: "",
  imgLink: "",
  status: "Ongoing",
  formVisible: false,
};

export const FormContext = createContext();
export const FormDispatchContext = createContext();

export const formReducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "CANCEL_FORM":
      return initialState;
    case "UPDATE":
      return { ...action.state };
    case "TOOGLE_MENU":
      return { ...state, formVisible: !state.formVisible };
    default:
      return { ...state };
  }
};

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {children}
      </FormDispatchContext.Provider>
    </FormContext.Provider>
  );
};

export const useForm = () => {
  return useContext(FormContext);
};

export const useFormDispatch = () => {
  return useContext(FormDispatchContext);
};
