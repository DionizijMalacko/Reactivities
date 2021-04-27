import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    inverted?: boolean;
    content?: string;
}

//drugi nacin za definisanje props, {sva polja u Props}: Props (tipa Props)
export default function LoadingComponent({inverted = true, content = 'Loading...'}: Props) {
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={content}/>
        </Dimmer>
    )
}