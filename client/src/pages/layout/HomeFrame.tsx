import React from 'react';
import { Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        top: 20,
        position: 'relative',
        height: 300,
        textAlign: 'center'
    },
    frame: {
        opacity: 0.7,
        position: 'absolute',
        backgroundColor: 'white',
        padding: 5,
        border: '1px inset #777',
        boxShadow: '10px 10px 14px -7px #777',
        userSelect: 'none',          /* Likely future */
        left: '50%',
        '&:hover': {
            opacity: 1,
            zIndex: 2,
        },
        '& img': {
            border: '1px inset #777',
            height: 200,
            cursor: 'pointer'
        }
    }
});

interface HomeFrameProps {
    src: string;
    style: React.CSSProperties;
}
// z-index:1; opacity: 1;
// top: 20px; left:-250px; transform: rotate(-7deg);
// top: 20px; left: 250px; transform: rotate(7deg);

export const PhotoFrame = (props: HomeFrameProps) => {
    const classes = useStyles();
    return (
        <Grid item className={classes.frame} style={props.style}>
            <img src={props.src} alt={'screen'} />
        </Grid>
    );
};

export const HomeFrame = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <PhotoFrame src='./images/photo1.jpg' style={{ zIndex:1, opacity: 1, transform: 'translateX(-50%)' }} />
            <PhotoFrame src='./images/photo2.jpg' style={{ top: -10, transform: 'rotate(-7deg) translateX(calc(-50% - 250px))' }} />
            <PhotoFrame src='./images/photo3.jpg' style={{ top: 20, transform: 'rotate(7deg) translateX(calc(-50% + 250px))' }} />
            
        </div>
    );
};