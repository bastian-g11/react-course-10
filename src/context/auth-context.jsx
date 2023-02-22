import { createContext } from "react";

//It returns an object that contains a component
const AuthContext = createContext({ isLoggedIn: false });

export default AuthContext;
