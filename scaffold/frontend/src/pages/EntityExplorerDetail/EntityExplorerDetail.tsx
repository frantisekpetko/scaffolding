import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Navigation } from "@/components";
import { EntityEditor } from "@/components";
import { Logger } from "@/utils/logger";

export default function EntityExplorerDetail(props: any): ReturnType<React.FC> {
	const { entity } = useParams();
	const LOG = Logger(`[${EntityExplorerDetail.name}.tsx]`, { enabled: true })
	LOG.warn('warn', entity);
	const [data, setData] = useState({});
	const socket = useRef<any>();

	const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);
	LOG.log('rerender')

	useEffect(() => {
		LOG.log(entity)
		socket.current = io(`http://localhost:3000/generator`);

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

		socket.current?.on("connect_error", (err: any) => {
			console.error(`connect_error`, err);
		});


		socket.current?.on('fireSendingDataForView', () => {
			LOG.log({ entity }, 'check')
			socket.current.emit('view', entity)
		});

		socket.current?.emit('view', entity)

		socket.current?.on('viewdata', (entityData: any) => {
			LOG.warn(entityData, 'xxxx');
			setData({ ...entityData.data });
		});


		socket.current?.emit('entities');

		socket.current?.on('entities', (data: any) => {
			LOG.warn(data, 'entities');
			let transformedData: any[] = [];

			if (data.length > 0) {
				transformedData = data
					.filter((item: any) => item.table !== entity)
					.map((item: any) => ({ label: item.entityName, value: { name: item.table } }));
			}

			setEntities([...transformedData]);
		})

		return () => {
			socket?.current.close()
			socket?.current.off('view');
			socket?.current.off('fireSendingDataForView');
			socket?.current.off('entity');
			socket.current.off('error');
		};
	}, [])

	useEffect(() => {
		LOG.log('check', entity)
	}, [entity])

	return <>
		<Navigation />
		<EntityEditor
			data={data}
			heading={`Entity editor`}
			entities={entities}
			isEditedEntity={true} />
		<Footer />
	</>;
}
