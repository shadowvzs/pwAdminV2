import React from "react";
import { Avatar, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { computed, makeObservable } from "mobx";
import cn from 'classnames';
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { EntityId } from "../models/BaseEntity";
import { Role } from "../models/User";
import { AuthStore } from "../stores/AuthStore";
import { UserStore } from "../stores/UserStore";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
        padding: 16,
    },
    listItem: {
        cursor: 'pointer',
        '&.active': {
            textShadow: '0 0 5px #005',
            fontWeight: 'bold',
            '& .avatar': {
                boxShadow: '0 0 10px 10px rgba(0, 0, 255, .15)',
                border: '1px solid #555'
            }
        }
    },
    avatar: {
        width: 24,
        height: 24,
    }
});

interface UserActionProps {
    userId?: EntityId;
}

class UserActionStore {
    public get users() {
        const currentUser = this.authStore.currentUser;
        if (currentUser?.role === Role.User) { 
            return [{
                id: currentUser.id,
                username: currentUser.name,
                fullname: currentUser.truename,
                avatar: currentUser.avatar
            }];
        }
        return this.userStore.users;
    }

    constructor(
        private authStore: AuthStore,
        private userStore: UserStore
    ) {
        makeObservable(this, {
            users: computed,
        });
    }
}

export const UserAction = observer((props: UserActionProps) => {
    const { authStore, userStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new UserActionStore(authStore, userStore))[0];
    const classes = useStyles();

    if (!authStore.currentUser) { return null; }

    return (
        <Grid className={classes.root}>
            <Typography 
                variant='h5'
                children='User Actions'
                noWrap
                style={{ textAlign: 'center' }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Grid container direction='column'>
                <Grid item>
                    Gold: 
                    <TextField 
                        type='number' 
                    />
                    <Button variant='contained' color='primary' size='small'>Add Gold</Button>
                </Grid>
                <Grid item>
                    GM: 
                    Currently GM
                    <Button variant='contained' color='primary' size='small'>Remove Gm</Button>
                </Grid>
                <Grid item>
                    Account: 
                    <Button variant='contained' color='secondary' size='small'>Delete Account</Button>
                </Grid>
                <Grid item>
                    Roles: 
                    <Button variant='contained' color='primary' size='small'>Load Roles</Button>
                    <Grid container direction='column'>
                        <Grid item>role1</Grid>
                        <Grid item>role2</Grid>
                        <Grid item>role3</Grid>
                    </Grid>
                </Grid>                 
            </Grid>
        </Grid>
    );
});
