
import { action, computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../../contexts/RootStoreContext"
import { Gender, Role, User } from "../../models/User";
import { AuthStore } from "../../stores/AuthStore";
import { IErrorMap, validateEmail, validatePassword, validateUsername } from "../../helpers/validations";
import { UserStore } from "../../stores/UserStore";
import { EntityId } from "../../models/BaseEntity";
import { makeStyles } from "@mui/styles";
import { Button, Checkbox, Divider, FormControlLabel, Grid, NativeSelect, TextField, Typography } from "@mui/material";

const useStyles = makeStyles({
    root: {
        position: 'relative',
        textAlign: 'center',
        padding: 16,
        display: 'inline-block',
        margin: 'auto',
        width: 'calc(100% - 32px)'
    }
});

class UserFormStore {
    public errors: IErrorMap<User> = {};
    public advanced: boolean = false;
    public user: User = new User();

    public setUser(user: User) { this.user = user; }
    public onToggle() { this.advanced = !this.advanced; }
    public onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const target = ev.currentTarget;
        const { name, value } = target;
        this.setValue(name, value);
    }

    public onSelect(ev: React.ChangeEvent<{ name?: string; value: unknown; }>) {
        let { name, value } = ev.target;
        if (!name) { return console.error('missing name for input', value); }
        this.setValue(name, value);
    }
    
    public setValue(name: string, value: any) {
        const user = this.user as Record<string, any>;
        if (['gender', 'role', 'id', 'postalcode'].includes(name)) {
            value = parseInt(value);
        } else if (false) {

        }
        user[name] = value;
    }

    public get isDisabled() {
        return (
            this.user.name.trim().length < 5 ||
            this.user.email.trim().length < 5 ||
            (this.user.id as number) % 16 !== 0
        )
    }

    public onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();

        const errors: IErrorMap<User> = {};

        if ((this.user.id as number) % 16 !== 0) {
            errors.id = 'Id must be multiple by 16.';
        }
        if (!validateUsername(this.user.name)) {
            errors.name = 'Username must be alphanumeric letters (5-32 character)';
        }
        if (this.user.passwd && !validatePassword(this.user.passwd)) {
            errors.passwd = 'Password must be alphanumeric letters (5-32 character)';
        }
        if (this.user.passwd && this.user.passwd !== this.user.passwd2) {
            errors.passwd2 = 'Make sure yout passwords match';
        }
        if (!validateEmail(this.user.email)) {
            errors.email = 'Need a email address';
        }

        this.errors = errors;
        if (Object.keys(errors).length) { return false; }
        this.userStore.update(this.user).then(() => {
            this.userStore.getList();
        });
        return false;
    }

    public async getUserDetail(id: EntityId) {
        try {
            const user = await this.userStore.get(id);
            this.setUser(user);
        } catch (err) {
            console.error(err);
        }
    }

    constructor(
        private authStore: AuthStore,
        private userStore: UserStore
    ) {
        makeObservable(this, {
            user: observable,
            advanced: observable,
            errors: observable,
            isDisabled: computed,
            onChange: action.bound,
            onSelect: action.bound,
            onSubmit: action.bound,
            setUser: action.bound,
            getUserDetail: action.bound,
            setValue: action.bound
        });
        this.setUser(this.authStore.currentUser || new User());
    }
}

interface UserFormProps {
    userId?: EntityId;
}

export const UserForm = observer((props: UserFormProps) => {
    const { authStore, userStore } = React.useContext(RootStoreContext);
    const store = React.useState(() => new UserFormStore(authStore, userStore))[0];
    const classes = useStyles();
    const { user, errors, onChange, onSelect, onSubmit } = store;
    const currentUser = authStore.currentUser;
    if (!currentUser) { return null; }
    const role = currentUser.role;

    React.useEffect(() => {
        if (!props.userId) { return; }
        store.getUserDetail(props.userId)
    }, [store, props.userId]);

    return (
        <form className={classes.root} noValidate autoComplete='off' onSubmit={onSubmit}>
            <Typography 
                variant='h5'
                children='User Settings'
                noWrap
                style={{ textAlign: 'center' }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Grid container direction='column' spacing={2}>
                {role === Role.Admin && (
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <TextField 
                                    fullWidth
                                    required
                                    name='id'
                                    placeholder='Id'
                                    value={user.id}
                                    onChange={onChange}
                                    error={!!errors.id}
                                    helperText={errors.id}
                                />
                            </Grid>
                            <Grid item xs>
                                <NativeSelect
                                    fullWidth
                                    value={user.role}
                                    name='role'
                                    onChange={onSelect}
                                >
                                    <option value={Role.User.toString()}>User</option>
                                    <option value={Role.Moderator.toString()}>Moderator</option>
                                    <option value={Role.Admin.toString()}>Admin</option>
                                </NativeSelect>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                autoComplete='off'
                                name='name'
                                placeholder='Username'
                                disabled={role < Role.Admin || !user.passwd}
                                value={user.name}
                                onChange={onChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                autoComplete='off'
                                name='truename'
                                placeholder='Real Name'
                                value={user.truename}
                                onChange={onChange}
                                error={!!errors.truename}
                                helperText={errors.truename}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                autoComplete='off'
                                type='email'
                                name='email'
                                placeholder='Email'
                                disabled={role < Role.Admin}
                                value={user.email}
                                onChange={onChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs>
                            <NativeSelect
                                fullWidth
                                value={String(user.gender) || '0'}
                                name='gender'
                                autoComplete='off'
                                onChange={onSelect}
                            >
                                <option value={Gender.Male.toString()}>Male</option>
                                <option value={Gender.Female.toString()}>Female</option>
                            </NativeSelect>
                        </Grid>
                    </Grid>
                </Grid>
                {(currentUser.id === user.id || role === Role.Admin) && (
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <TextField 
                                    fullWidth
                                    required
                                    autoComplete='new-password'
                                    type='password'
                                    name='passwd'
                                    placeholder='Password'
                                    value={user.passwd || ''}
                                    onChange={onChange}
                                    error={!!errors.passwd}
                                    helperText={errors.passwd}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    fullWidth
                                    required
                                    autoComplete='new-password'
                                    type='password'
                                    name='passwd2'
                                    placeholder='Confirm Password'
                                    value={user.passwd2 || ''}
                                    onChange={onChange}
                                    error={!!errors.passwd2}
                                    helperText={errors.passwd2}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}                
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='phonenumber'
                                placeholder='Phone number'
                                value={user.phonenumber}
                                onChange={onChange}
                                error={!!errors.phonenumber}
                                helperText={errors.phonenumber}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='mobilenumber'
                                placeholder='Mobile number'
                                value={user.mobilenumber}
                                onChange={onChange}
                                error={!!errors.mobilenumber}
                                helperText={errors.mobilenumber}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='province'
                                placeholder='Province'
                                value={user.province}
                                onChange={onChange}
                                error={!!errors.province}
                                helperText={errors.province}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='city'
                                placeholder='City'
                                value={user.city}
                                onChange={onChange}
                                error={!!errors.city}
                                helperText={errors.city}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='address'
                                placeholder='Address'
                                value={user.address}
                                onChange={onChange}
                                error={!!errors.address}
                                helperText={errors.address}
                            />
                        </Grid>
                        {role !== Role.User && (
                            <Grid item xs>
                                <TextField 
                                    fullWidth
                                    required
                                    type='number'
                                    name='credit'
                                    placeholder='Shop Point'
                                    value={user.credit}
                                    onChange={onChange}
                                    error={!!errors.credit}
                                    helperText={errors.credit}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='prompt'
                                placeholder='Prompt'
                                value={user.prompt}
                                onChange={onChange}
                                error={!!errors.prompt}
                                helperText={errors.prompt}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                name='answer'
                                placeholder='Answer'
                                value={user.answer}
                                onChange={onChange}
                                error={!!errors.answer}
                                helperText={errors.answer}
                            />
                        </Grid>
                    </Grid>
                </Grid>                
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <TextField 
                                fullWidth
                                required
                                type='datetime-local'
                                name='birthday'
                                placeholder='Birthday'
                                value={user.birthday?.substr(0, 19)}
                                onChange={onChange}
                                error={!!errors.birthday}
                                helperText={errors.birthday}
                            />
                        </Grid>
                        {role !== Role.User && (
                            <Grid item xs>
                                <TextField 
                                    fullWidth
                                    required
                                    type='datetime-local'
                                    name='creatime'
                                    placeholder='Create Time'
                                    value={user.creatime?.substr(0, 19)}
                                    onChange={onChange}
                                    error={!!errors.creatime}
                                    helperText={errors.creatime}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {false && (
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={store.advanced}
                                        onChange={store.onToggle}
                                        name="checkedB"
                                        color="primary"
                                    />
                                    }
                                    label="Show Advanced"
                                />
                            </Grid>                    
                            <Grid item xs>
                                <input
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    id='raised-button-file'
                                    type='file'
                                />
                                <label htmlFor='raised-button-file'>
                                    <Button 
                                        variant='contained' 
                                        style={{ fontSize: 10, marginTop: 4 }}
                                    >
                                        Upload
                                    </Button>
                                </label> 
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                <Grid item style={{ marginTop: 16 }}>
                    <Button 
                        type='submit' 
                        color='primary' 
                        variant='contained'
                        disabled={Object.keys(errors).length > 0}
                    >Save</Button>
                </Grid>
            </Grid>
        </form>
    )
});
