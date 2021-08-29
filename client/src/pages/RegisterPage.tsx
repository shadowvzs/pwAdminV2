import { Grid } from "@material-ui/core"
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