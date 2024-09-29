import "./FooterStyles.scss";
import { Flex } from "@/components";

const Footer = (props: any) => {
	return <div className="Footer">
		<Flex
			justifyContent={'space-between'}
			direction={'row'}
			alignItems={'center'}
			styles={{ height: '100%' }}
		>
			<p className={'FooterText'}>
				Autor: František Petko
			</p>
			<p className={'FooterText'}>
				Development Code Generator
			</p>
		</Flex>
	</div>
};

export default Footer;
