import { createContext } from "react";

const Context = createContext<any>({ error: '', hasError: false });

export default Context;
