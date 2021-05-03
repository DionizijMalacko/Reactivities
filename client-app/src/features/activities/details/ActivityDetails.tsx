import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Card, Image} from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


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
                    <Button as={Link} to={`/manage/${selectedActivity.id}`} basic color='blue' content='Edit'/>
                    <Button as={Link} to='/activities' basic color='grey' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
})