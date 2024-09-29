import Star from "../../assets/starful.png";
import packageJSON from "../../../package.json";
import { Flex, Footer, LazyImage, Navigation } from "@/components";

export default function Welcome() {
	return (
		<>
			<Navigation />
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				alignContent={'center'}
				styles={{
					width: '100%',
					height: '100%',
					marginTop: '2em'
				}}
			>
				<LazyImage image={{ alt: 'dawda', src: Star, width: 250, height: 250 }} />
				<h1
					style={{
						borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
						padding: '1em',
						width: '55%',
						textAlign: 'center'
					}}
				>
					Welcome
				</h1>
				<p>
					react: {packageJSON.dependencies["react"]}<br />
					react-dom: {packageJSON.dependencies["react-dom"]}
				</p>
			</Flex>
			<Footer />
		</>
	)
}
