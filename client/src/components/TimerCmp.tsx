import React from "react";
import { RootStoreContext } from "../contexts/RootStoreContext";

const getTimeStr = (srvrTmZone: number) => {
    const d = new Date();
    const date = new Date(Date.now() + srvrTmZone * 1000 + d.getTimezoneOffset() * 60000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
}

interface TimerCmpProps {
    style?: React.CSSProperties;
}

export const TimerCmp = (props: TimerCmpProps) => {
    const { configStore } = React.useContext(RootStoreContext);
    const [time, setTime] = React.useState<string>(getTimeStr(configStore.config.get('serverTimeZone') || 0));

    React.useEffect(() => {
        const int = window.setInterval(() => {
            getTimeStr(0);
            setTime(getTimeStr(0));
        }, 1000);
        return () => clearInterval(int);
    }, []);

    return (<div style={props.style}>{time}</div>);
}