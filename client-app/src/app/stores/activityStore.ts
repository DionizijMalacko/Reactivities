import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {format} from 'date-fns';


export default class ActivityStore {
    //activities: Activity[] = []; //inicijalizujemo na praznu listu 
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    //bound da bi automatski bindovao taj properti sa tom klasom (action.bound)
    //ili ako koristimo arrow function kod setera ne moramo da definisemo .bound posto on automatski to odradi
    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
    }
    
    //grupira po datumu
    //ako je datum isti kreira niz i dodaje tu aktivnost koja ima isti datum
    //ako nije onda kreira novi niz koji sadrzi samo tu aktivnost
    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        ); //kreiramo array objekata koji ima kljuc key tipa string i objekat kao niz activity
    }

    //dodajemo async zbog toga sto kada dobavljamo pomocu get metode takodje je async na backu
    loadActivities = async () => {
        this.loadingInitial = true; //moramo da ga pozovemo da bi imali konzistentno ukljucivanje spinnera
        //sve sto je sinhrono ide u try catch blok navodno
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            //ako ne vratimo nista, async vraca Promise<void>, a ako vratimo activity vraca Promis<Activity | undefined>
            return activity; //mroamo da vracamo activity zbog forme
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity; //mora u runInAction zbog warninga
                })
                this.setLoadingInitial(false);
                return activity; //isto i ovde
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }

        }
    }
    
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }


    createActivity = async (activity: Activity) => {
        this.loading = true;
        //activity.id = uuid(); brisemo zato sto uuid sada kreiramo kod forme
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