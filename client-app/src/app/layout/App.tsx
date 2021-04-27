import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { Fragment } from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';


//ovo vracamo kada pozovemo App
function App() {

  //useStore je reack hook koji smo kreirali u store.ts
  //activityStore predstavlja instancu ActivityStore zapravo
  //useStore pravi kontext od store, a store sadrzi ActivityStore
  const {activityStore} = useStore();


  //poziva get metodu i stavlja response u nas state
  useEffect(() => { //kod get metode sada mozemo da specificiramo koji tip podataka ce dobaviti
    activityStore.loadActivities();
  }, [activityStore]); //moramo da ga prosledimo kao dependency


  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app...'/>

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '10em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
