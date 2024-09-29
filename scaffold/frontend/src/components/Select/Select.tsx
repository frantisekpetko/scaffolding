import React from "react";
import SelectStyles from "./Select.module.scss";
import { adjustColor } from "../../utils/colors";
import { Flex } from "@/components";

export default function Select(
	props: {
		label: string,
		//data: { [name: string]: string },
		data: any,
		value: string,
		onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
		styles?: Object | undefined,
		themeColor: string
	}) {
	return (
		<Flex
			direction={'column'}
			width={'40%'}
		>
			<label>{props.label}</label>
			<select
				title='select'
				onChange={props.onChange}
				value={props.value}
				className={SelectStyles.Select}
				style={{
					background: `url(https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg)
                    no-repeat right 0.8em center / 1.4em,
                    linear-gradient(to left, ${adjustColor(props.themeColor, -50)} 
                    3em, ${adjustColor(props.themeColor, 5)} 3em)`
				}}
			>
				{props.data.map((item: { label: string, value: { [name: string]: string }; }, i: React.Key) => (
					<option
						value={item.value.name}
						key={i}
						style={{
							backgroundColor: adjustColor(props.themeColor, 5)

						}}
					>{item.label}</option>

				))
				}
			</select>
		</Flex>)
}
