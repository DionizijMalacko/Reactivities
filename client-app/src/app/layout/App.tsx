import React, { useEffect, useState } from 'react';
import axios from'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Fragment } from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


//ovo vracamo kada pozovemo App
function App() {

  //kreiranje state, prva komponenta je za cuvanje state a druga je funkcija kojom updatujemo state
  const [activities, setActivities] = useState<Activity[]>([]); //definisemo da je to niz Activities tj .ts fajla koji smo kreirali

  //kreiramo jos jedan state posto moramo da saljemo podatke od child komponente do parenta
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);



  //poziva get metodu i stavlja response u nas state
  useEffect(() => { //kod get metode sada mozemo da specificiramo koji tip podataka ce dobaviti
    agent.Activities.list().then(response => {
      let activities: Activity[] = []; //delimo datum na vise polja, uzimamo prvi deo koji je samo datum
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      console.log(response);
      setActivities(activities);
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    //x je sada activity, prolazi se kroz sve iz liste i uporedje se sa x.id dok ne vrati true, tj dok ne nadje koji je tacan
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  //ove funkcije prosledjujem dole kao props
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  //filter ostavlja sve koji zadovoljavaju uslov
  //prosledjujemo activity, ako vec postoji izbaci je i postavi novi objekat u listu(izmenjen)
  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);

    //ako postoji updejtuj
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      //ako ne, onda kreiraj novu
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if (loading) return <LoadingComponent content='Loading app...'/>

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '10em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}/>
      </Container>
    </Fragment>
  );
}

export default App;
