import { Grid } from "@material-ui/core"
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"
import { RoleManagement } from "../components/Users/RoleManagement";

export const RolePage = () => {
    const { authStore } = React.useContext(RootStoreContext);
    const params = useParams<{id: string }>();
    
    if (!authStore.currentUser || isNaN(+params?.id)) {
        return <Redirect to='/login' />;
    }

    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <Grid item> <RoleManagement /> </Grid>
        </Grid>
    )
};