import "./SwitchStyles.scss";
import React, { useEffect } from "react";

export default function Switch(props: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, checked: boolean }) {
	useEffect(() => {
		console.log(props.checked)
	}, [props.checked])

	return <>
		<div className="container">
			<label
				className="switch"
				htmlFor="checkbox"
			>
				<input
					type="checkbox"
					id="checkbox"
					checked={props.checked}
					onChange={props.onChange}
				/>
				<div className="slider round"></div>
			</label>
		</div>
	</>
}
