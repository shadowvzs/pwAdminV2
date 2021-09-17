import { makeStyles } from "@mui/styles";
import { Button, Grid, TextField } from "@mui/material";
import { action, computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../contexts/RootStoreContext"
import { ILoginDto } from "../models/User";
import { AuthStore } from "../stores/AuthStore";
import { IErrorMap, validatePassword, validateUsername } from "../helpers/validations";

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        padding: 16,
        backgroundColor: 'rgba(200,200,255,0.5)',
        border: '1px solid rgba(0,0,0,0.5)',
        borderRadius: 8,
        display: 'inline-block',
        margin: 'auto',
        marginTop: 32
    }
});

class LoginStore {
    public username: string = '';
    public password: string = '';
    public errors: IErrorMap<ILoginDto> = {};

    public onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const target = ev.currentTarget;
        const { name, value } = target;
        this[name as keyof ILoginDto] = value;
    }

    public get isDisabled() {
        return (
            this.username.trim().length < 1 ||
            this.password.trim().length < 1
        )
    }

    public onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();

        const errors: IErrorMap<ILoginDto> = {};

        if (!validateUsername(this.username)) {
            errors.username = 'Username must be alphanumeric letters (5-32 character)';
        }
        if (!validatePassword(this.password)) {
            errors.password = 'Password must be alphanumeric letters (5-32 character)';
        }
        this.errors = errors;
        // if (Object.keys(errors).length) { return false; }
        this.authStore.login({ username: this.username, password: this.password });        
        return false;
    }

    constructor(private authStore: AuthStore) {
        makeObservable(this, {
            username: observable,
            password: observable,
            errors: observable,
            isDisabled: computed,
            onChange: action.bound,
            onSubmit: action.bound
        });
    }
}

export const LoginForm = observer(() => {
    const { authStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new LoginStore(authStore))[0];
    const classes = useStyles();
    const { username, password, errors, onChange, onSubmit } = store;

    return (
        <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <TextField 
                        fullWidth
                        required
                        name='username'
                        placeholder='Username'
                        value={username}
                        onChange={onChange}
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                </Grid>
                <Grid item>
                    <TextField 
                        fullWidth
                        required
                        autoComplete='off'
                        name='password'
                        placeholder='Password'
                        value={password}
                        type='password'
                        onChange={onChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                    <Button 
                        type='submit' 
                        color='primary' 
                        variant='contained'
                        disabled={Object.keys(errors).length > 0}
                    >Login</Button>
                </Grid>
            </Grid>
        </form>
    )
});
