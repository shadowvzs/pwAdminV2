import { makeStyles } from "@mui/styles";
import { Button, Grid, TextField } from "@mui/material";
import { action, computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../contexts/RootStoreContext"
import { IRegisterDto } from "../models/User";
import { AuthStore } from "../stores/AuthStore";
import { IErrorMap, validateEmail, validatePassword, validateUsername } from "../helpers/validations";

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

class RegisterStore {
    public username: string = '';
    public email: string = '';
    public password: string = '';
    public password2: string = '';
    public errors: IErrorMap<IRegisterDto> = {};

    public onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const target = ev.currentTarget;
        const { name, value } = target as { name: keyof IRegisterDto, value: string };
        this[name as keyof IRegisterDto] = value;
    }

    public onSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const errors: IErrorMap<IRegisterDto> = {};

        if (!validateUsername(this.username)) {
            errors.username = 'Username must be alphanumeric letters (5-32 character)';
        }
        if (!validateEmail(this.email)) {
            errors.email = 'Give a valid email address';
        }
        if (!validatePassword(this.password)) {
            errors.password = 'Password must be alphanumeric letters (5-32 character)';
        }

        if (this.password !== this.password2) {
            errors.password2 = 'Make sure yout passwords match';
        }

        this.errors = errors;
        console.warn(errors);
        if (Object.keys(errors).length) { return false; }
        this.authStore.register({ username: this.username, password: this.password, email: this.email });
        return false;
    }

    public get isDisabled() {
        return (
            this.username.trim().length < 1 ||
            this.email.trim().length < 1 ||
            this.password.trim().length < 1||
            this.password2.trim().length < 1
        )
    }

    constructor(private authStore: AuthStore) {
        makeObservable(this, {
            username: observable,
            email: observable,
            password: observable,
            password2: observable,
            errors: observable,
            isDisabled: computed,
            onChange: action.bound,
            onSubmit: action.bound
        });
    }
}

export const RegisterForm = observer(() => {
    const { authStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new RegisterStore(authStore))[0];
    const classes = useStyles();
    const { username, password, password2, email, errors, onChange, onSubmit } = store;

    return (
        <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <TextField 
                        fullWidth
                        required
                        size='small'
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
                        size='small'
                        name='email'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={onChange}
                        error={!!errors.email}
                        helperText={errors.email}                        
                    />
                </Grid>
                <Grid item>
                    <TextField 
                        fullWidth
                        required
                        size='small'
                        autoComplete='off'
                        name='password'
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={onChange}
                        error={!!errors.password}
                        helperText={errors.password}                        
                    />
                </Grid>
                <Grid item>
                    <TextField 
                        fullWidth
                        required
                        size='small'
                        autoComplete='off'
                        name='password2'
                        placeholder='Password Again'
                        type='password'
                        value={password2}
                        onChange={onChange}
                        error={!!errors.password2}
                        helperText={errors.password2}                        
                    />
                </Grid>                
                <Grid item style={{ marginTop: 16 }}>
                    <Button 
                        type='submit' 
                        color='primary' 
                        variant='contained'
                        disabled={store.isDisabled}
                    >Register</Button>
                </Grid>
            </Grid>
        </form>
    )
});
