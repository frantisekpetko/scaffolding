
import React, {ReactNode} from 'react';

interface Props {
    children?: ReactNode;
    hasError: boolean;
    error: string;
}

interface State {
    hasError: boolean;
    error: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false, error: '' };

    constructor(props: any) {
        super(props);
        
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.log({error});
        this.setState({error: error.message})
    }

    render() {
        console.log(this.props.hasError, this.props.error)
        if (this.props.hasError) {
            return <div role="alert">
                <p>Something went wrong:</p>
                <pre>{this.props.error}</pre>
         
            </div>
        }

        return this.props?.children;
    }
}