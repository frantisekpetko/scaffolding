import React from "react";
import CheckboxStyles from './Checkbox.module.scss';

export default function Checkbox(props: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    checked: boolean
}) {
    return <>
        <input
            className={CheckboxStyles.Checkbox}
            type={'checkbox'}
            checked={props.checked}
            onChange={props.onChange}
            title="Checkbox"
        />
    </>
}
