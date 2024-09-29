import EntityStyles from "./EntityExplorer.module.scss";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Flex, Footer, Navigation } from "@/components";
import { JsonFetch } from "@/utils/net";

const Comp = (props: any) => {
	const { err, text } = props;
	return <>Websockets connection problem.<br />{text}</>
}

export default function EntityExplorer(props: any): ReturnType<React.FC> {

	const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);

	const [loading, setLoading] = useState<boolean>(true);

	const socket = useRef<any>();

	async function getData() {
		//setLoading(true);
		const data = await (await JsonFetch.get('entitygen')).json();
		console.log({ data })
		setEntities(data);
		setLoading(false);
	}

	useEffect(() => {

		socket.current = io(`http://localhost:3000/generator`);

		socket.current.on("connect_error", (err: any) => {
			console.log(`connect_error`, err);
		});

		socket.current.on('error', function (err: any) {

			if (Object.hasOwn(err, 'data') && Object.hasOwn(err.data, 'message')) {
				toast.error(`${err.data.message}`, {
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

			console.warn('err', { err });
		});

		socket.current.on('ping', function (err: any) {
			if (typeof console !== "undefined" && console !== null) {
				console.log("Socket.io reported a generic error");
			}
			console.warn('err', { err });

		});

		socket.current.on('update', (data: any) => console.log(data))

		socket.current.on('connect_error', (err: any) => {
			console.log(err);
			toast.dismiss()
			toast.error((<Comp err={err} text={'Try start your server first!'} />), {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "colored",
				icon: true
			});
			setLoading(false);
		})
		socket.current.on('connect_failed', (err: any) => console.log(err))
		socket.current.on('disconnect', (err: any) => console.log(err))

		socket.current.emit('entities');

		socket.current.on('delete', (data: any) => {
			setLoading(true);
			setEntities(data);
			setLoading(false);
		})

		socket.current.on('entities', (data: any) => {
			console.log('entities', data)
			setLoading(true);
			setEntities(data);
			setLoading(false);
		})
		//getData();

		return () => {
			socket.current.close()
			socket.current.off('entities')
			socket.current.off('delete')
			socket.current.off('error')
		};
	}, []);

	const navigate = useNavigate();

	const openInNewTab = (url: string) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}

	return <>
		<Navigation />
		<Flex
			width='100%'
			justifyContent='center'
			styles={{
				margin: '5em 0 1em 0',
				flex: '1 0 auto'
			}}
			alignItems='center'
			direction='column'>
			<h1>Entity explorer</h1>
			<ul className={EntityStyles.list}>
				{(!loading) ?
					entities.map((item, index) => {
						return <li
							key={Date.now() + Math.random()}
							className={EntityStyles.li}
						>

							<label
								htmlFor="list-input1"
								className={EntityStyles.title}
								style={{ display: 'flex', lineHeight: '1em' }}
							>
								<span
									style={{
										width: '100%',
										display: 'flex',
										cursor: 'pointer'
									}}
									onClick={() => navigate(`/explorer/${item.table}`)}
								>
									<b
										style={{
											width: '100%',
											display: 'flex'

										}}
										className={EntityStyles.pointer}

									>
										{item.entityName}
									</b>
									<span
										className={EntityStyles.filename}>
										{item.filename}
									</span>
								</span>



								<FontAwesomeIcon
									icon={faTrash}
									style={{ justifyContent: 'flex-end' }}
									className={EntityStyles.pointer}
									onClick={async () => {

										//JsonFetch.delete(`entitygen/entity/${item.filename}`).then(async () => await getData()).catch((e) => console.log(e));
										//setTimeout(async () => await getData(), 1500)
										//await getData();
										try {
											setLoading(true);
											socket.current.emit('delete', item.filename);
											//await fetch(`entitygen/entity/${item.filename}`, {method: 'DELETE'});
											//JsonFetch.delete(`entitygen/entity/${item.filename}`);//.then(async () => await getData());
											//socket.current.emit('entities');

										} catch (error) {
											console.warn('Error', error);
										}
										finally {
											setLoading(false);
										}
									}}
								/>


							</label>
						</li>

					})

					: <Flex
						justifyContent='center'>
						<span className={EntityStyles.loading}></span>
					</Flex>}
				{(entities.length < 1 && !loading) &&
					<Flex justifyContent='center'><span>No data</span></Flex>
				}
			</ul>
		</Flex>
		<Footer />
	</>;
}
