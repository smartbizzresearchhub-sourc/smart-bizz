import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const InterestContext = createContext(null);

export function InterestProvider({ children }) {
  const [interest, setInterest] = useState("");
  const navigate = useNavigate();

  // Optionally pre-select an area of interest, then open the Contact page.
  const startConversation = useCallback(
    (value) => {
      if (value) setInterest(value);
      navigate("/contact");
    },
    [navigate],
  );

  return (
    <InterestContext.Provider value={{ interest, setInterest, startConversation }}>
      {children}
    </InterestContext.Provider>
  );
}

export function useInterest() {
  const ctx = useContext(InterestContext);
  if (!ctx) throw new Error("useInterest must be used inside InterestProvider");
  return ctx;
}
