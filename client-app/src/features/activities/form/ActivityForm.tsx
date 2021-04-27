import React, { useState } from 'react';
import { ChangeEvent } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    submitting: boolean;
}

export default function ActivityForm(props: Props) {

    //ako je activiti null onda ce biti sve sto se nalazi na desnoj strani ??
    const initialState = props.activity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        props.createOrEdit(activity);
    }

    //ova funkcija nam sluzi da bi react znao da mi kucamo nesto u formi, posto bez nje mozemo da kucamo ali nista se nece prikazati
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        //name i value zato sto smo ih dole u Form.Input naveli pa njih prati
        const {name, value} = event.target;
        //kopira sva polja od activiti, i nalazi jedno sa kljucem name i postavlja ga na novu vrednost kad se stisne submit
        setActivity({...activity, [name]: value})
    }

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
                <Button loading={props.submitting} floated='right' postive type='submit' content='Submit' color='green'/>
                <Button  onClick={props.closeForm} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
}