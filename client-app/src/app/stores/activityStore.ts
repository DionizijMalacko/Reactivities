import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';


export default class ActivityStore {
    //activities: Activity[] = []; //inicijalizujemo na praznu listu 
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    //bound da bi automatski bindovao taj properti sa tom klasom (action.bound)
    //ili ako koristimo arrow function kod setera ne moramo da definisemo .bound posto on automatski to odradi
    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    //dodajemo async zbog toga sto kada dobavljamo pomocu get metode takodje je async na backu
    loadActivities = async () => {
        //sve sto je sinhrono ide u try catch blok navodno
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                //ovo je malo cudno ali tako je, razliciti activities
                //this.activities.push(activity); //mobX je mutable, pa mozemo da mutiramo objekte direktno ? -> stari nacin ako radimo sa listom
                this.activityRegistry.set(activity.id, activity); //novi nacin kada radimo sa mapom
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        //this.selectedActivity = this.activities.find(a => a.id === id); -> pomocu liste
        this.selectedActivity = this.activityRegistry.get(id); // -> pomocu mape
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    //id je optional posto mozemo editovati vec postojecu activity ili kreirati novu
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    } 

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                //this.activities.push(activity); -> sa listom
                this.activityRegistry.set(activity.id, activity); // -> sa mapom
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity]; -> lista
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== id)]; -> lista
                this.activityRegistry.delete(id);
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }

    }

}