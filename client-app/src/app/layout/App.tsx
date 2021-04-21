import React, { useEffect, useState } from 'react';
import axios from'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Fragment } from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';


//ovo vracamo kada pozovemo App
function App() {

  //kreiranje state, prva komponenta je za cuvanje state a druga je funkcija kojom updatujemo state
  const [activities, setActivities] = useState<Activity[]>([]); //definisemo da je to niz Activities tj .ts fajla koji smo kreirali

  //kreiramo jos jedan state posto moramo da saljemo podatke od child komponente do parenta
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  const [editMode, setEditMode] = useState(false);



  //poziva get metodu i stavlja response u nas state
  useEffect(() => { //kod get metode sada mozemo da specificiramo koji tip podataka ce dobaviti
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
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
    activity.id 
    ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) 
    : setActivities([...activities, {...activity, id: uuid()}]);
    //ako ga nema znaci da kreiramo novi objekat

    setEditMode(false);
    //da nam otvori informacije o activity koji smo editovali ili kreirali
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

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
          deleteActivity={handleDeleteActivity}/>
      </Container>
    </Fragment>
  );
}

export default App;
