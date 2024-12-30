import Context from "./context/Context";
import DatabaseAssistant from "@/pages/DatabaseAssistant";
import EntityExplorer from "@/pages/EntityExplorer";
import EntityExplorerDetail from "@/pages/EntityExplorerDetail";
import EntityGenerator from "@/pages/EntityGenerator";
import ErrorBoundary from "./components/ErrorBoundary";
import Main from "./pages/Main";
import NotFound from "@/pages/NotFound";
import { useState } from "react";
import { Logger } from "./utils/logger";

import {
	RouterProvider,
	createBrowserRouter
} from "react-router-dom";


function App() {
	const LOG = Logger(`[${App.name}.tsx]`, { enabled: true })
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState('');

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main />
		},
		{
			path: "/entity",
			element: <EntityGenerator />,
		},
		{
			path: "/explorer",
			element: <EntityExplorer />,
		},
		{
			path: "/explorer/:entity",
			element: <EntityExplorerDetail />,
		},
		{
			path: '/assistant',
			element: <DatabaseAssistant />
		},
		{
			path: '/*',
			element: <NotFound />
		}
	]);

	return (
		<Context.Provider value={{ error, hasError, setError, setHasError }}>
			<Context.Consumer>
				{(context) => <ErrorBoundary {...context}><RouterProvider router={router} /></ErrorBoundary>}
			</Context.Consumer>
		</Context.Provider>
	);
}

export default App
