import { Grid } from "@material-ui/core"
import { HomeFrame } from "./layout/HomeFrame"
import { HomeHeader } from "./layout/HomeHeader"
import { HomeMenu } from "./layout/HomeMenu"
import { HomeNews } from "./layout/HomeNews"
import { HomeTitle } from "./layout/HomeTitle"

export const HomePage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <HomeMenu /> </Grid>
            <Grid item> <HomeTitle /> </Grid>
            <Grid item> <HomeFrame /> </Grid>
            <Grid item> <HomeNews /> </Grid>
        </Grid>
    )
};