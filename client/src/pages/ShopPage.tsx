import { Grid } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"

export const ShopPage = () => {
    const { authStore } = React.useContext(RootStoreContext);
    if (!authStore.currentUser) {
        return <Redirect to='/login' />;
    }

    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
        </Grid>
    )
};