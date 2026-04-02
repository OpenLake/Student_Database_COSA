import { useContext } from "react";
import { createContext, useState } from "react";

export const RequestContext = createContext();

export function RequestProvider({ children }) {
  const [requestStatus, setRequestStatus] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })

  return (
    <RequestContext.Provider
      value={{ requestStatus, setRequestStatus }}
    >
      {children}
    </RequestContext.Provider>
  );
}

//Custom Hook
export function useRequest() {
  return useContext(RequestContext);
}
