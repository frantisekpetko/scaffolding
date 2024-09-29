import { FC } from "react";
import { Flex, Footer, Navigation } from "@/components";

interface Props { }

const NotFound: FC<Props> = () => {
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
			>
				<h1>Error 404: Page Not Found</h1>
			</Flex>
			<Footer />
		</>
	);
}

export default NotFound;
