import { createContext} from "react";
const Context = createContext<any>({ error: '', hasError: false });
//const value= useContext<any>({error: ''});

export default Context;