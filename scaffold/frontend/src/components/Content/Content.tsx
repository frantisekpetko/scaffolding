import "./ContentStyles.scss";
import { Card } from "@/components";

export type CardInfo = {
	name: string,
	description: string,
	info: string,
	path: string
};

const cardInfo: CardInfo[] = [
	{
		name: 'Entity generator',
		description: 'This generator allows to generate schema of data in given table as entity in database, or generate Active-Record class having CRUD database to current entity with generated data schema.',
		info: 'dawadw',
		path: '/entity'
	},
	{
		name: 'Entity explorer',
		description: 'This generator generates a relationships between entities/tables, after generating common entities, and helps you assemble your database together.',
		info: 'dawadw',
		path: '/explorer'
	},
	{
		name: 'Route Generator',
		description: 'This generator helps you quickly generate a new route collection corresponding with your CRUD and API.',
		info: 'dawadw',
		path: '/dawdwad'
	},
	{
		name: 'Database Assistant',
		description: 'This generator/assistant helps you with routine tasks at database, like seeding data to database, cleaning up and removing data from database and re-creating of database schema.',
		info: 'dawadw',
		path: '/assistant'
	}
]

export default function Content(props: any) {
	return (
		<>
			<div className={'grid'}>
				{cardInfo.map((item, index) => {
					return <Card item={item} key={Date.now() + Math.random()} />
				})}
			</div>
		</>
	)
}
