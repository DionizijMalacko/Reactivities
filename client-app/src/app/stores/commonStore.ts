import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        //kod reakcije prvi parametar je na sta reagujemo a drugi sta radimo
        reaction(
            () => this.token,
            token => {
                if(token) {
                    window.localStorage.setItem('jwt', token)
                } else {
                    window.localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        //ovaj if nam vise ne treba posto sto definisali reakciju tkao da ce se ona pozivati
        //if(token) window.localStorage.setItem('jwt', token); //key=jwt, value=token...
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}