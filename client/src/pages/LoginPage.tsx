import { Grid } from "@material-ui/core"
import { LoginForm } from "../components/LoginForm"
import { HomeHeader } from "./layout/HomeHeader"
import { HomeMenu } from "./layout/HomeMenu"


export const LoginPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <HomeMenu /> </Grid>
            <LoginForm />
        </Grid>
    )
};