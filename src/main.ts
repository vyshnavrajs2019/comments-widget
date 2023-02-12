import "./style.css";
import { IComment } from "./typings/Comment.d";
import { init as initComments, onComment } from "./components/comments";
import { init as initForm, resetForm } from "./components/form";

const OWNER: IComment["author"] = {
	id: 1,
	fullname: "S Vyshnav Raj",
};

const COMMENTS: IComment[] = [
	{
		id: 1,
		body: "Awesome post!, Please post such informative posts regularly.",
		createdOn: new Date(),
		updatedOn: new Date(),
		author: OWNER,
		comments: [
			{
				id: 1,
				body: "Exactly!",
				createdOn: new Date(),
				updatedOn: new Date(),
				author: {
					id: 2,
					fullname: "John Doe",
				},
				comments: [
					{
						id: 4,
						body: "Thanks!",
						createdOn: new Date(),
						updatedOn: new Date(),
						author: OWNER,
					},
				],
			},
			{
				id: 2,
				body: "Absolutely!",
				createdOn: new Date(),
				updatedOn: new Date(),
				author: {
					id: 3,
					fullname: "David Abraham",
				},
				comments: [
					{
						id: 5,
						body: "Thank you, David",
						createdOn: new Date(),
						updatedOn: new Date(),
						author: OWNER,
					},
				],
			},
		],
	},
	{
		id: 3,
		body: "CFBR",
		createdOn: new Date(),
		updatedOn: new Date(),
		author: {
			id: 2,
			fullname: "John Doe",
		},
	},
];

initComments(resetForm, COMMENTS, OWNER);
initForm(onComment);
