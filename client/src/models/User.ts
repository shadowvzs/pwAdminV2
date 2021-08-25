import { EntityId } from "./BaseEntity";

export class UserDto {

}

export interface ILoginDto {
    username: string;
    password: string;
}

export interface IRegisterDto {
    username: string;
    email: string;
    password: string;
    password2?: string;
}

export enum Role {
    None      = 0,
    User      = 1,
    Moderator = 2,
    Admin     = 3
}

export enum Gender {
    Female = 0,
    Male = 1
}

export class User {
    public id: EntityId;
    public name: string;
    public prompt: string;
    public answer: string;
    public truename: string;
    public idnumber: string;
    public email: string;
    public mobilenumber: string;
    public province: string;
    public city: string;
    public phonenumber: string;
    public address: string;
    public postalcode: string;
    public gender: Gender;
    public birthday: string;
    public creatime: string;
    public qq: string;
    public role: Role;
    public shoppoint: number;
    public avatar: string;
    public access_token?: string;
    public refresh_token?: string;
}