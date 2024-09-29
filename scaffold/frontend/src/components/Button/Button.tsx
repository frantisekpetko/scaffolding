import React, {ReactNode} from 'react';
import "./ButtonStyles.scss";

export enum ButtonType {
    'SUBMIT' = 'submit',
    'BUTTON' = 'button'
}

const Button = (props: { type: ButtonType, name?: string, children: ReactNode, styles?: React.CSSProperties, onClick: () => void }) => {
    return (
        <button
            type={props.type}
            className={'Button'}
            data-text={props.children}
            style={{ ...props.styles}}
            onClick={props.onClick}
        >
            <span>{props.children}</span>
        </button>
    );
}

export default Button;