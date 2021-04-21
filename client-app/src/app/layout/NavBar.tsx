import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
    openForm: () => void;

}

export default function NavBar(props: Props) {
    
    //inverted da bi bio crniji, fixed da uvek bude gore
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button onClick={props.openForm} positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}