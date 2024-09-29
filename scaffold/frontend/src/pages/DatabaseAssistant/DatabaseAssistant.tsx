import "sweetalert2/src/sweetalert2.scss";
import DatabaseAssistantStyles from "./DatabaseAssistant.module.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FC } from "react";
import { toast } from "react-toastify";
import { Button, Flex, Footer, Navigation } from "@/components";
import { ButtonType } from "@/components/Button/Button";
import { JsonFetch } from "@/utils/net";

interface Props {

}

const DatabaseAssitant: FC<Props> = () => {

	async function assistantRequest(parameters:
		{
			url: string,
			title: string,
			text: string,
			confirmButtonText: string,
			callback?: () => Promise<void>
		}) {
		const { url, title, text, confirmButtonText } = parameters;

		try {
			const CustomizedSwal = withReactContent(Swal)

			const result = await CustomizedSwal.fire({
				title: title,
				icon: 'warning',
				text: text,
				showConfirmButton: true,
				showCancelButton: true,
				confirmButtonText: confirmButtonText,
				denyButtonText: 'Cancel',
				denyButtonColor: '#f8bb86'

			});

			if (result.isConfirmed) {

				requestHandler(url);


			}
		}
		catch (error) {
			console.error({ error })
			toast.error(`${JSON.stringify(error, null, 4)}`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "colored",
				icon: true
			});
		}
	}

	async function requestHandler(url: string) {

		try {
			const response = await JsonFetch.post(url, {});

			if (response.ok) {
				toast.success(`The action was successfully performed!`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "colored",
					icon: true
				});
			}
			else {
				const data = await response.json();
				console.warn(data);
				toast.error(data.message, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "colored",
					icon: true
				});
			}
		} catch (error) {

			toast.error(`${JSON.stringify(error, null, 4)}`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "colored",
				icon: true
			});

		}
	}

	return (
		<>
			<Navigation />
			<Flex
				width='100%'
				justifyContent='center'
				styles={{
					margin: '5em auto 1em auto',
					flex: '1 0 auto'
				}}
				alignItems='center'
				direction='column'
				className={DatabaseAssistantStyles.container}
			>
				<h1 style={{ marginBottom: '2rem' }}>Database assistant</h1>

				<Button
					type={ButtonType.BUTTON}
					onClick={() => {
						assistantRequest({
							url: 'assistant/tables',
							title: 'Might critical loss of database schema!',
							text: "You gonna intend to obliterate database schema, are you sure?",
							confirmButtonText: 'Yes, delete it!'
						})
					}}>
					Delete all tables
				</Button>


				<Button
					type={ButtonType.BUTTON}
					onClick={() => {
						assistantRequest({
							url: 'assistant/data',
							title: "Might critical loss of data!",
							text: "You gonna intend to obliterate data in database, are you sure?",
							confirmButtonText: 'Yes, delete it!'
						});
					}}>
					Delete data in all tables
				</Button>


				<Button
					type={ButtonType.BUTTON}
					onClick={async () => {
						requestHandler('assistant/schema/persist');
					}}>
					Persist database schema
				</Button>


				<Button
					type={ButtonType.BUTTON}
					onClick={async () => {
						assistantRequest({
							url: 'assistant/schema/recreate',
							title: 'Might critical loss of database schema!',
							text: "You are gonna intend to recreate database schema, you might overwrite your entities with database backup, are you sure?",
							confirmButtonText: 'Yes, overwrite it!'
						});
					}}>
					Recreate database schema
				</Button>
			</Flex>
			<Footer />

		</>
	);
}

export default DatabaseAssitant;
