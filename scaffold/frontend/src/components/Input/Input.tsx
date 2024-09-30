import "./InputStyles.scss";
import * as React from "react";
import { useId, useState } from "react";

export default function Input(props: {
	placeholder: string,
	styles?: Object | undefined,
	value: string | number | undefined,
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {

	const [state, setState] = useState('');
	const Id = useId();

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			<label
				htmlFor={props.placeholder + Id}
				className={state !== '' ? 'faded-label' : ''}
			>
				{props.placeholder}
			</label>
			<input
				value={props.value}
				placeholder={(props).placeholder}
				className={`Input ${state}`}
				onFocus={() => setState('active')}
				onBlur={() => setState('')}
				onChange={props.onChange}
			/>
		</div>
	)
}
