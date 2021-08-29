import { Grid } from "@material-ui/core"
import React from "react";
import { Redirect } from "react-router-dom";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"

export const ServerSettingsPage = () => {
    const { authStore } = React.useContext(RootStoreContext);
    if (!authStore.currentUser) {
        return <Redirect to='/login' />;
    }

    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>

            <Grid item>
                PW Web
                <Grid container direction='column'>
                    <Grid item> server name </Grid>
                    <Grid item> enable shop </Grid>
                    <Grid item> starter gold </Grid>
                    <Grid item> max credit limit </Grid>
                    <Grid item> -- </Grid>
                </Grid>
            </Grid>

            <Grid item>
                PW Server config
                <Grid container direction='column'>
                    <Grid item> add gold for active users </Grid>
                    <Grid item> delete inactive users </Grid>
                    <Grid item> ban role </Grid>
                    <Grid item> chat message </Grid>                    
                </Grid>
            </Grid>
        </Grid>
    )
};