import Button, { ButtonType } from "../Button/Button";
import Flex from "../Flex/Flex";
import ModalStyles from "./Modal.module.scss";
import React, { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Logger } from "../../utils/logger";

const Modal: React.FC<{ open: boolean, modalOpenSwitcherHandler: () => void, data: string, name: string, onClick: () => Promise<void> }> = (props) => {
	const LOG = Logger(`[${Modal.name}.tsx]`, { enabled: true })

	LOG.log('rerender');

	let classNameRef = React.useRef<string | null>(null);

	useEffect(() => {
		setTimeout(() => classNameRef.current = 'effect', 500);
		console.log(SyntaxHighlighter.supportedLanguages)

	}, [])


	useEffect(() => {
		if (props.open) {
			window.document.body.style.overflow = 'hidden';

		}
		else {

			document.body.style.overflow = 'auto';

		}
	}, [props.open])

	if (!props.open) return null;

	return (
		<div className={ModalStyles.Modal}>
			<div className={ModalStyles.ModalContent}>
				<span
					className={ModalStyles.Close}
					onClick={props.modalOpenSwitcherHandler}>
					&times;
				</span>
				<h3>{`${props.name.toLowerCase()}.entity.ts`}</h3>

				<SyntaxHighlighter
					language="typescript"
					style={gruvboxLight}
				>
					{props.data}
				</SyntaxHighlighter>
				<Flex
					justifyContent='space-between'
					styles={{ maxWidth: '100%' }}
				>
					<Button
						type={ButtonType.BUTTON}
						onClick={props.modalOpenSwitcherHandler}>
						Cancel
					</Button>
					<Button
						type={ButtonType.BUTTON}
						onClick={props.onClick}>
						Generate
					</Button>
				</Flex>
			</div>
		</div>
	);
};

export default Modal;
