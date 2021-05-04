import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid} from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';


export default observer(function ActivityDashboard() {

    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    //poziva get metodu i stavlja response u nas state
    useEffect(() => { //kod get metode sada mozemo da specificiramo koji tip podataka ce dobaviti
        if (activityRegistry.size <= 1) loadActivities(); //da ne bi svaki put ucitavali activities, zbog toga ovaj if
    }, [activityRegistry.size, loadActivities]); // <= 1 zato sto ako je === 0  onda ucita samo jednu activity kod renderovanja


    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app...'/> 

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='5'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})