
import { Grid } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { UserManagement } from "../components/Users/UserManagement";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"

export const UserSettingsPage = () => {
    const { authStore } = React.useContext(RootStoreContext);
    if (!authStore.currentUser) {
        return <Redirect to='/login' />;
    }

    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <UserManagement />
        </Grid>
    )
};