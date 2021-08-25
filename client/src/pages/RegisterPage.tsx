import { Grid } from "@material-ui/core"
import { RegisterForm } from "../components/RegisterForm"
import { HomeHeader } from "./layout/HomeHeader"
import { HomeMenu } from "./layout/HomeMenu"


export const RegisterPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <HomeMenu /> </Grid>
            <RegisterForm />
        </Grid>
    )
};