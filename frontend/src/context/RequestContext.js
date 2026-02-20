import { useContext } from "react";
import { createContext, useState } from "react";

export const RequestContext = createContext();

export function RequestProvider({ children }) {
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [total, setTotal] = useState(0);

  return (
    <RequestContext.Provider
      value={{
        pending,
        setPending,
        approved,
        setApproved,
        rejected,
        setRejected,
        total,
        setTotal,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

//Custom Hook
export function useRequest() {
  return useContext(RequestContext);
}
