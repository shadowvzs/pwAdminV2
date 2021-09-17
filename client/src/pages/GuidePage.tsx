import { Grid } from "@mui/material";
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"

const GuideBox = () => {
    return (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
            <img src='./images/class/Class_Guide.jpg'  alt='Class paths' width={800} />
        </div>
    );
}

export const GuidePage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <GuideBox />
        </Grid>
    )
};