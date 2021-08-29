import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../contexts/RootStoreContext";
import { EntityId } from "../models/BaseEntity";
import { Role } from "../models/User";
import { AuthStore } from "../stores/AuthStore";
import { UserStore } from "../stores/UserStore";
import { UserAction } from "./UserAction";
import { UserForm } from "./UserForm";
import { UserList } from "./UserList";

const useStyles = makeStyles({
    root: {
        margin: 'auto',
        width: 'auto',
        marginTop: 32,
        padding: 16,
        backgroundColor: 'rgba(200,200,255,0.5)',
        border: '1px solid rgba(0,0,0,0.5)',
        borderRadius: 8,        
    }
});

class UserManagementStore {
    public isListLoading: boolean = false;
    public selectedUserId?: EntityId = undefined;
    public setSelectedUserId(selectedUserId?: EntityId) { this.selectedUserId = selectedUserId; }

    public async getUserList() {
        this.isListLoading = true;
        try {
            await this.userStore.getList();
        } catch (err) {
            // np
        } finally {
            runInAction(() => { this.isListLoading = false; })
        }
    }

    constructor(
        private authStore: AuthStore,
        private userStore: UserStore
    ) {
        makeObservable(this, {
            isListLoading: observable,
            selectedUserId: observable,
            getUserList: action.bound,
            setSelectedUserId: action.bound,
        });

        this.setSelectedUserId(this.authStore.currentUser?.id)
    }
}

export const UserManagement = observer(() => {
    const classes = useStyles();
    const { authStore, userStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new UserManagementStore(authStore, userStore))[0];
    if (!authStore.currentUser) { return null; }
    const role = authStore.currentUser.role;

    React.useEffect(() => {
        store.getUserList();
    }, [store]);

    return (
        <Grid container className={classes.root}>
            {role !== Role.User && (
                <>
                    <Grid item xs={12} sm={6} md={3}>
                        <UserList 
                            userId={store.selectedUserId}
                            selectUserId={(id: EntityId) => store.setSelectedUserId(id)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <UserAction userId={store.selectedUserId} />
                    </Grid>
                </>
            )}
            <Grid item xs={12} sm={12} md={6}>
                <UserForm userId={store.selectedUserId} />
            </Grid>
        </Grid>
    );
});
