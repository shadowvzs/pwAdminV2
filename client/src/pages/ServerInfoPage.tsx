import { Grid } from "@material-ui/core"
import { HomeHeader } from "./layout/HomeHeader"
import { HomeMenu } from "./layout/HomeMenu"

const serverInfo: [string, string][] = [
    ['videoUrl', 'https://www.youtube.com/embed/IgqX23xSZbI'],
    ['Note', 'Server for PvP fans, gear and everything important buyable somehow!'],
    ['Version', '1.4.1'],
    ['Language', 'PW MS & PW MY-EN'],
    ['Race', 'Human, Beastkind, Elf'],
    ['Skills', 'Normal + Lv79 & 100'],
    ['Server rate', 'Normal 1x, but have culti and exp pill'],
    ['Leveling', 'Normal way or with pills'],
    ['Elemental Elf', 'On, like original server.'],
    ['Start', 'HH90 Armor +12 and weapon +9, money, shop gold, all skill maxed, Level 96 and Lv 79 Culti'],
    ['Other', 'More fashion, flyer, instant cultivation pill in shop'],
    ['Map info', 'World map and mostly heaven/hell world, if needed could open more instance (max 4 exclude world)'],

];

const ServerInfoBox = () => {
    const [video, ...rows] = serverInfo;
    return (
        <Grid container justifyContent='center' style={{ marginTop: 32 }}>
            <Grid item>
                <iframe src={video[1]} title={video[0]} style={{ float: 'left' }} width='420' height='315'></iframe>
            </Grid>
            <Grid item style={{ padding: 16, maxWidth: 500 }}>
                <table>
                    <tbody>
                        {rows.map(([title, content], idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 'bold' }}>{title}</td>
                                <td>{content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Grid>
        </Grid>
    );
}

export const ServerInfoPage = () => {
    return (
        <Grid container direction='column'>
            <Grid item> <HomeHeader /> </Grid>
            <Grid item> <HomeMenu /> </Grid>
            <ServerInfoBox />
        </Grid>
    )
};