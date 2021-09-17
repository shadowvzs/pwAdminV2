import { Grid } from "@mui/material"
import { HomeFrame } from "./layout/HomeFrame"
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"
import { HomeNews } from "./layout/HomeNews"
import { HomeTitle } from "./layout/HomeTitle"

export const HomePage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <Grid item> <HomeTitle /> </Grid>
            <Grid item> <HomeFrame /> </Grid>
            <Grid item> <HomeNews /> </Grid>
        </Grid>
    )
};