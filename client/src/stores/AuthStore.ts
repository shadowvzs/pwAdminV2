import { plainToClass } from "class-transformer";
import { action, makeObservable, observable } from "mobx";
import { AuthTokenPayload, AuthUserTokenResponse } from "../interfaces/Response";

import { ILoginDto, IRegisterDto, User } from "../models/User";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

export class AuthStore extends BaseStore<User> {
    public currentUser: User | null;
    public setCurrentUser(currentUser: User | null) { this.currentUser = currentUser; } 
    public rootStore: RootStore;
    private refreshTokenTimeout: number;
    private refreshToken: string;
    private accessToken: string;

    public async login(data: ILoginDto) {
        try {
            const result = await this.request<AuthUserTokenResponse>(this.endpoint + '/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
            });
            if (!result) { return; }
            const user = plainToClass(User, result.user);
            this.setCurrentUser(user);
            this.setToken(result.payload);
            setTimeout( async () => {
                const result3 = await this.request<AuthUserTokenResponse>(this.endpoint + '/me');
                console.log(result3);
            }, 3000);
            this.rootStore.redirect('/user-settings');
        } catch(err) {
            console.error(err);
        }
    }

    public logout() {
        this.setCurrentUser(null);
        this.setToken();
    }

    public async register(data: IRegisterDto) {
        try {
            const result = await this.request<AuthUserTokenResponse>(this.endpoint + '/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
            });
            if (!result) { return; }
            const user = plainToClass(User, result.user);
            this.setCurrentUser(user);
            this.setToken(result.payload);
            this.rootStore.redirect('/user-settings');
        } catch(err) {
            console.error(err);
        }
    }

    private setToken(payload?: AuthTokenPayload) {
        this.stopRefreshTokenTimer();
        if (payload) {
            this.accessToken = payload.token;
            if (payload.refresh_token) { this.refreshToken = payload.refresh_token; }
            this.defaultHeaders.set('Authorization', 'Bearer ' + this.accessToken);
            this.startRefreshTokenTimer();
        } else {
            this.accessToken = '';
            this.refreshToken = '';
            this.defaultHeaders.delete('Authorization');            
        }
    }

    public async refreshAccessToken() {
        this.stopRefreshTokenTimer();
        const result = await this.request<AuthUserTokenResponse>(this.endpoint + '/refresh', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: { refresh_token: this.refreshToken }
        });
        this.setToken(result.payload);
        console.log(result);
    }

    private startRefreshTokenTimer() {
        const jwtToken = JSON.parse(atob(this.accessToken.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (10 * 1000);
        this.refreshTokenTimeout = window.setTimeout(() => this.refreshAccessToken(), timeout);
    }
    
    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    constructor(
        rootStore: RootStore
    ) {
        super('auth', User);
        makeObservable(this, {
            currentUser: observable,
            setCurrentUser: action.bound,
        });
        this.rootStore = rootStore;
    }
}

/*
    (status === 401 && headers['www-authenticate'] === 'Bearer error="invalid_token", error_description="The token is expired"') {
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired, please login again');
*/