import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


export default function ActivityDetails() {

    const {activityStore} = useStore();

    //ovo navodimo samo da ne bismo morali pisati activityStore.openForm nego samo openForm sa parametrima...
    const {selectedActivity, openForm, cancelSelectedActivity} = activityStore;

    //typescript je skontao da selectedActivity moze biti i undefined pa pravi problem
    if (!selectedActivity) return <LoadingComponent/>; //ova linija je samo da bi se izbegli errori

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity.description}
                </Card.Description>
                </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => openForm(selectedActivity.id)} basic color='blue' content='Edit'/>
                    <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}