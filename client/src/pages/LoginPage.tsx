import { Grid } from "@mui/material";
import { LoginForm } from "../components/LoginForm"
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"


export const LoginPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <LoginForm />
        </Grid>
    )
};