import {ReactNode} from "react";

type FlexDirection =
    "column" |
    "inherit" |
    "-moz-initial" |
    "initial" |
    "revert" |
    "unset" |
    "column-reverse" |
    "row" |
    "row-reverse" |
    undefined;

type FlexPosition =
    "stretch" |
    "center" |
    "flex-start" |
    "flex-end" |
    "space-between" |
    "space-around" |
    "space-evenly" |
    undefined;

export default function Flex(props: {
    children: ReactNode,
    width?: string,
    direction?: FlexDirection,
    alignContent?: FlexPosition,
    justifyContent?: FlexPosition,
    alignItems?: FlexPosition,
    styles?: Object | undefined,
    className?: string | undefined
}) {
    return <>
        <span 
            style={
                {
                    display: 'flex',
                    flexDirection: props.direction,
                    justifyContent: props.justifyContent,
                    alignItems: props.alignItems,
                    alignContent: props.alignContent,
                    width: props.width ? props.width : 'none',
                    ...props.styles
                }
            }
            className={props.className !== undefined ? props.className : ''}
        >
            {props.children}
        </span>
    </>
}