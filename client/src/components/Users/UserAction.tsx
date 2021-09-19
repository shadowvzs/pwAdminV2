
import React from "react";
import { makeStyles } from "@mui/styles";

import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../contexts/RootStoreContext";
import { EntityId } from "../../models/BaseEntity";
import { Role } from "../../models/User";
import { RootStore } from "../../stores/RootStore";
import { UserRoleItem } from "../../models/RoleBean";
import { Link } from "react-router-dom";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar } from "notistack";

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
    roleItem: {
        
    },
    avatar: {
        width: 24,
        height: 24,
    }
});

interface UserActionProps {
    selectedUserId?: EntityId;
}

class UserActionStore {
    public selectedUserId?: EntityId;
    public roles: UserRoleItem[] = [];

    public setRoles(roles: UserRoleItem[]) { this.roles = roles; }

    public get users() {
        const currentUser = this.rootStore.authStore.currentUser;
        if (currentUser?.role === Role.User) { 
            return [{
                id: currentUser.id,
                username: currentUser.name,
                fullname: currentUser.truename,
                avatar: currentUser.avatar
            }];
        }
        return this.rootStore.userStore.users;
    }

    public get isGm(): boolean {
        return Boolean(this.users.find(x => this.selectedUserId === x.id)?.gm);
    }

    public toggleGmRank = async () => {
        if (!this.selectedUserId) { return null; }
        if (this.isGm) {
            await this.rootStore.userStore.demoteFromGM(this.selectedUserId);
            this.notify('User not GM anymore', { variant: 'success' });
        } else {
            await this.rootStore.userStore.promoteToGM(this.selectedUserId);
            this.notify('User was promoted to GM', { variant: 'success' });
        }
    }

    public onDelete = async () => {
        if (!this.selectedUserId) { return null; }
        try {
            await this.rootStore.userStore.delete(this.selectedUserId);
            this.notify('User account was deleted', { variant: 'success' });
        } catch (err) {
            this.notify('Something went wrong', { variant: 'error' });
        }
    }

    public onLoadRoles = async () => {
        if (!this.selectedUserId) { return null; }
        const roles = await this.rootStore.userStore.getRoles(this.selectedUserId);
        this.setRoles(roles);
    }

    constructor(
        private rootStore: RootStore,
        private notify: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey
    ) {
        makeObservable(this, {
            users: computed,
            roles: observable,
            setRoles: action.bound
        });
    }
}

export const UserAction = observer((props: UserActionProps) => {
    const rootStore = React.useContext(RootStoreContext);
    const { enqueueSnackbar } = useSnackbar();    
    // const onCopyToClipboard = React.useCallback(() => {
    //     const i = inputRef.current!;
    //     i.select();
    //     i.setSelectionRange(0, 99999);
    //     navigator.clipboard.writeText(i.value);
    //     enqueueSnackbar('Octet was copied to clipboard!', { variant: 'success' })
    const store = React.useState(() => new UserActionStore(rootStore, enqueueSnackbar))[0];
    store.selectedUserId = props.selectedUserId;
    const classes = useStyles();

    React.useEffect(() => {
        if (!props.selectedUserId) { return; }
        store.onLoadRoles();
    }, [store, props.selectedUserId])

    if (!rootStore.authStore.currentUser || !store.selectedUserId) { return null; }

    return (
        <Grid className={classes.root}>
            <Typography 
                variant='h5'
                children='User Actions'
                noWrap
                style={{ textAlign: 'center' }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <Grid 
                        container 
                        wrap='nowrap' 
                        spacing={2} 
                        alignItems='center' 
                        justifyContent='space-between'
                    >
                        <Grid item>
                            <TextField 
                                size='small'
                                type='number' 
                                placeholder='Gold'
                            />
                        </Grid>
                        <Grid item>
                            <Button 
                                variant='contained' 
                                color='primary' 
                                size='small'
                            >
                                    Add
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid 
                        container 
                        wrap='nowrap' 
                        spacing={2} 
                        alignItems='center' 
                        justifyContent='space-between'
                    >
                        <Grid item>
                            <b>Status:</b> {store.isGm ? 'Gm' : 'Not Gm'}
                        </Grid>
                        <Grid item>
                            <Button 
                                variant='contained' 
                                color='primary' 
                                size='small'
                                onClick={store.toggleGmRank}
                                children={store.isGm ? 'Demote' : 'Promote'}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid 
                        container 
                        wrap='nowrap' 
                        spacing={2} 
                        alignItems='center' 
                        justifyContent='space-between'
                    >
                        <Grid item>
                            <b>Account:</b>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant='contained' 
                                color='secondary' 
                                size='small'
                                onClick={store.onDelete}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid 
                        container 
                        wrap='nowrap' 
                        spacing={2} 
                        alignItems='center' 
                        justifyContent='space-between'
                    >
                        <Grid item>
                            <b>Roles:</b>
                        </Grid>
                        <Grid item>
                            {store.roles.length === 0 && 'No role on this user'}
                            {/* <Button 
                                variant='contained' 
                                color='secondary' 
                                size='small'
                                onClick={store.onLoadRoles}
                            >
                                Load
                            </Button> */}
                        </Grid>
                    </Grid>
                    {store.roles.length > 0 && (
                        <Grid container direction='column'>
                            <Table padding='none' style={{ marginTop: 16 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='right'><h3>Id</h3></TableCell>
                                        <TableCell align='right'><h3>Name</h3></TableCell>
                                        <TableCell align='right'> </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {store.roles.map(role => (
                                        <TableRow key={role.id}>
                                            <TableCell align='right'>{role.id}</TableCell>
                                            <TableCell align='right'>{role.name}</TableCell>
                                            <TableCell align='right'>
                                                <Link className={classes.roleItem} to={`/role/${role.id}`}>
                                                    <Visibility />
                                                </Link>
                                            </TableCell>                                     
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    )}
                </Grid>                 
            </Grid>
        </Grid>
    );
});
