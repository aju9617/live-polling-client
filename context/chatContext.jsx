import React, { useContext, useReducer } from "react";
const NEW_MESSAGE = "NEW_MESSAGE";

const Context = React.createContext();

export const useChatContext = () => {
  const data = useContext(Context);
  return data;
};

const initialState = {
  newMessages: 0,
  messages: [],
  senders: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case NEW_MESSAGE: {
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

  const incMessageNotification = () => {
    dispatch({
      type: NEW_MESSAGE,
      payload: { newMessages: value.newMessages + 1 },
    });
  };

  const resetMessageNotification = (data) => {
    dispatch({
      type: NEW_MESSAGE,
      payload: { newMessages: 0 },
    });
  };

  return (
    <Context.Provider
      value={{ ...value, incMessageNotification, resetMessageNotification }}
    >
      {children}
    </Context.Provider>
  );
};
