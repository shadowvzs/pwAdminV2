import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { action, makeObservable, observable, runInAction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../../contexts/RootStoreContext";
import { AuthStore } from "../../stores/AuthStore";
import { RoleStore } from "../../stores/RoleStore";
import { useParams } from "react-router-dom";
import { RoleBean } from "../../models/RoleBean";

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

class RoleManagementStore {
    public isListLoading: boolean = false;
    public roleBean?: RoleBean = undefined;
    public setRoleBean(roleBean?: RoleBean) { this.roleBean = roleBean; }

    public async getRoleData(roleId: string) {
        const id = parseInt(roleId);
        if (isNaN(id)) {
            this.setRoleBean(undefined);
            return;
        }

        this.isListLoading = true;
        try {
            const roleBean = await this.roleStore.get(id);
            this.setRoleBean(roleBean);
        } catch (err) {
            // np
        } finally {
            runInAction(() => { this.isListLoading = false; })
        }
    }

    constructor(
        private authStore: AuthStore,
        private roleStore: RoleStore
    ) {
        makeObservable(this, {
            isListLoading: observable,
            roleBean: observable,
            getRoleData: action.bound,
            setRoleBean: action.bound,
        });
    }
}

export const RoleManagement = observer(() => {
    const classes = useStyles();
    const { authStore, roleStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new RoleManagementStore(authStore, roleStore))[0];
    const params = useParams<{ id: string }>();
    if (!authStore.currentUser) { return null; }
    // const role = authStore.currentUser.role;

    React.useEffect(() => {
        store.getRoleData(params.id);
    }, [store, params.id]);

    console.log(toJS(store.roleBean));

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} style={{ maxWidth: '100vw' }}>
                <pre style={{ overflowX: 'auto', wordBreak: 'break-all' }}>
                    {JSON.stringify(toJS(store.roleBean), null, 4)}
                </pre>
            </Grid>
        </Grid>
    );
});
