import React, { useContext, useReducer } from "react";
const SET_SOCKET_CONNECTION = "SET_SOCKET_CONNECTION";

const Context = React.createContext();

export const useSocketContext = () => {
  const data = useContext(Context);
  return data;
};

const initialState = {
  auth: false,
  socketId: "",
  socket: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_SOCKET_CONNECTION: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export const Provider = ({ children }) => {
  const [value, dispatch] = useReducer(reducer, initialState);

  const setSocketConnection = (data) => {
    dispatch({ type: SET_SOCKET_CONNECTION, payload: { ...data, auth: true } });
  };

  return (
    <Context.Provider value={{ ...value, setSocketConnection }}>
      {children}
    </Context.Provider>
  );
};
