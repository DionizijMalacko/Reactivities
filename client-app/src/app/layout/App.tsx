import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { Fragment } from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';


//ovo vracamo kada pozovemo App
function App() {

  //location sadrzi u sebi key koji koristimo za pracenje da li nesto promenilo u formi
  const location = useLocation(); //ako jeste, da bi rerenderovao formu sa praznim poljima

  return (
    <Fragment>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{marginTop: '10em'}}>
              <Route exact path='/activities' component={ActivityDashboard}/>
              <Route path='/activities/:id' component={ActivityDetails}/>
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
