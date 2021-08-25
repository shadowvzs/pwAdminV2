import { Grid } from "@material-ui/core"
import { HomeHeader } from "./layout/HomeHeader"
import { HomeMenu } from "./layout/HomeMenu"

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
            <Grid item> <HomeMenu /> </Grid>
            <GuideBox />
        </Grid>
    )
};