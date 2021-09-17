import { Grid } from "@mui/material";
import { RegisterForm } from "../components/RegisterForm"
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"


export const RegisterPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <RegisterForm />
        </Grid>
    )
};