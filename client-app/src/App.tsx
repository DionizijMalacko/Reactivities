import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from'axios';
import { Header, List } from 'semantic-ui-react';

//ovo vracamo kada pozovemo App
function App() {

  //kreiranje state, prva komponenta je za cuvanje state a druga je funkcija kojom updatujemo state
  const [activities, setActivities] = useState([]);

  //poziva get metodu i stavlja response u nas state
  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    });
  }, []);

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities'/>

        <List>
          {activities.map((activity: any) => (
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
        </List>
    </div>
  );
}

export default App;
