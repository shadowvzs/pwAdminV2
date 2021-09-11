import { Grid } from "@material-ui/core"
import { HomeHeader } from "./layout/HomeHeader"
import { PageMenu } from "./layout/PageMenu"

const DownloadBox = () => {
    
    return (
        <Grid container justifyContent='center' style={{ marginTop: 32 }}>
            <Grid item>
                <br /><br />
                <table>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>
                                <a href='https://drive.google.com/open?id=0BzQbqnVz5iizLTJzMnhUMThPaXc'>
                                    <img src='./images/download.png' alt='Download Client' style={{ verticalAlign: 'middle' }} />
                                </a> Download v2 Full Client from Google Drive (3.5gb) 
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>
                                <a href='https://drive.google.com/open?id=0BzQbqnVz5iizQm1MZjdhc2dwLWc'>
                                    <img src='./images/download.png' alt='Download Patch' style={{ verticalAlign: 'middle' }} />
                                </a> Download v1-2 manual patch (few mb)
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br /><br />
                <b>Note:</b> the full client need to extract and it is running, but manual patch file need extract and replace the files with old one in client.
            </Grid>
        </Grid>
    );
}

export const DownloadPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <PageMenu /> </Grid>
            <DownloadBox />
        </Grid>
    )
};