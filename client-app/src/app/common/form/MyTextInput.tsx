import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';


interface Props {
    placeholder: string;
    name: string;
    label?: string;
}


//za reusable Input
export default function MyTextInput(props: Props) {

    const [field, meta] = useField(props.name);

    //!! -> pravi od objekta ili od ncega Boolean, posto ce error biti string ili undefined on ga pretvori u boolean
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}