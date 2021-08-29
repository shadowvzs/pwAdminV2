import React from "react";
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { action, computed, makeObservable, observable } from "mobx";
import cn from 'classnames';
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { EntityId } from "../models/BaseEntity";
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
            color: 'red',
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

interface UserListProps {
    userId?: EntityId;
    selectUserId: (id: EntityId) => void;
}

class UserListStore {
    public searchTerm: string = '';
    public onSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        this.searchTerm = ev.target.value;
    }

    public get users() {
        return this.userStore.users.filter(x => x.username.startsWith(this.searchTerm));
    }

    constructor(
        private authStore: AuthStore,
        private userStore: UserStore
    ) {
        makeObservable(this, {
            users: computed,
            searchTerm: observable,
            onSearch: action.bound,
        });
    }
}

export const UserList = observer((props: UserListProps) => {
    const { authStore, userStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new UserListStore(authStore, userStore))[0];
    const classes = useStyles();

    if (!authStore.currentUser) { return null; }

    return (
        <Grid className={classes.root}>
            <Typography 
                variant='h5'
                children='User List'
                noWrap
                style={{ textAlign: 'center' }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <TextField 
                fullWidth
                placeholder='Search...'
                value={store.searchTerm}
                onChange={store.onSearch}
            />
            <List dense className={classes.root}>
                {store.users.map(u => (
                    <ListItem 
                        key={u.id}
                        className={cn(classes.listItem, u.id === props.userId && 'active')}
                        onClick={() => props.selectUserId(u.id)}
                    >
                        <ListItemAvatar>
                            <Avatar className={cn(classes.avatar, 'avatar')}>
                                <img src={u.avatar || './images/avatar.png'} height="100%" alt={'User: ' + u.id} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`${u.username} [${u.id}]`} />
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
});
