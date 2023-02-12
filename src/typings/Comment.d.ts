export interface IComment {
	id: number;
	body: string;
	createdOn: Date;
	updatedOn: Date;
	author: {
		id: number;
		fullname: string;
	};
	comments?: IComment[];
}

export type TCommentEvent = {
	body: string;
	id: number;
	parentid: number;
};

export type TCommentsEventMap = keyof HTMLElementEventMap | "comments";

export type TonComment = (body: string, id: number, parentid: number) => void;
