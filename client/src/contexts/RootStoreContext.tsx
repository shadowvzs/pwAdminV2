import { CircularProgress } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { RootStore } from "../stores/RootStore";

export const RootStoreContext = React.createContext<RootStore>(null as any);

export const RootStoreContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const store = React.useState(() => new RootStore())[0];
    const [isLoading, setIsLoading] = React.useState(true);
    const history = useHistory();

    React.useEffect(() => {
        store.init().finally(() => setIsLoading(false));
        store.redirect = (url: string) => history.push(url);
        return () => store.dispose();
    }, [store, history]);

    return (
        <RootStoreContext.Provider value={store}>
            {isLoading ? <CircularProgress /> : children}
        </RootStoreContext.Provider>
    );
};