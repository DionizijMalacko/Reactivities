import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';


export default observer(function ActivityForm() {

    //jos jedna react hook koji nam sluzi za kao neku redirekciju
    const history = useHistory();

    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();

    //inicijalno stanje forme da bude uvek prazno, brisemo initialState od pre
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    //activity se vraca iz funkcije i prosledjujemo ga u setActivity
    useEffect(() => {
        if(id) { 
            loadActivity(id).then(activity => setActivity(activity!))
        }
    }, [id, loadActivity]); //kada postavljamo state kao setActivity u ovom slucaju moramo da prosledimo dependencies
    //ako ne prosledimo, komponenta ce se rerenderovati i useEffect ce se pet izvrsiti i tako u krug
    //dependency znaci da pazi na njih, ako se desi neka promena on ce to primetiti bez stalnog rerenderovanja
    //useEffect se izvrsi samo kada se neki od ta dva dependency-ja promeni


    //activity.id nam je ili nista ili neki ID, zbog toga poredimo sa 0
    function handleSubmit() {
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity, 
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`)) 
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    //ova funkcija nam sluzi da bi react znao da mi kucamo nesto u formi, posto bez nje mozemo da kucamo ali nista se nece prikazati
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        //name i value zato sto smo ih dole u Form.Input naveli pa njih prati
        const {name, value} = event.target;
        //kopira sva polja od activiti, i nalazi jedno sa kljucem name i postavlja ga na novu vrednost kad se stisne submit
        setActivity({...activity, [name]: value})
    }

    if(loadingInitial) return <LoadingComponent content='Loading activity...' />

    //clearing da bi obrisao sve prethodne nzm sta, kada ti naprimer dugmici izadju iz forme, sa time resavas
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button loading={loading} floated='right' postive type='submit' content='Submit' color='green'/>
                <Button as={Link} to={'/activities'} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
})