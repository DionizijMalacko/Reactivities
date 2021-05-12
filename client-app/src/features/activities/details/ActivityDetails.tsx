import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import {Grid} from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';


export default observer(function ActivityDetails() {

    const {activityStore} = useStore();

    //ovo navodimo samo da ne bismo morali pisati activityStore.openForm nego samo openForm sa parametrima...
    const {selectedActivity, loadActivity, loadingInitial} = activityStore;

    //posto je po defaultu objekat moramo da mu kazemo koji tip treba da nam vrati
    const {id} = useParams<{id: string}>(); //koristimo useParams za dobavljanje aktivity

    //koristimo useEffect za sideEffect koji nam treba
    useEffect(() => {
        if(id) loadActivity(id);
    }, [id, loadActivity]); //prosledjujemo dva parametra kao dependencies (nzm zasto)

    //typescript je skontao da selectedActivity moze biti i undefined pa pravi problem
    if (loadingInitial || !selectedActivity) return <LoadingComponent/>; //ova linija je samo da bi se izbegli errori

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={selectedActivity}/>
                <ActivityDetailedInfo activity={selectedActivity}/>
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={selectedActivity} />
            </Grid.Column>
        </Grid>
    )
})