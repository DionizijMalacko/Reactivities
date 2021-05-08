import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';


interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}


//za reusable Input
export default function MySelectInput(props: Props) {
    //helpers nam pomazu da manualno promenimo values i touch status naseg input-a
    const [field, meta, helpers] = useField(props.name);

    //!! -> pravi od objekta ili od ncega Boolean, posto ce error biti string ili undefined on ga pretvori u boolean
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select 
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(e, d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}