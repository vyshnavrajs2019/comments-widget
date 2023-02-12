import {
	IComment,
	TonComment,
	TCommentEvent,
	TCommentsEventMap,
} from "../typings/Comment.d";
import { TresetForm } from "../typings/Form.d";

const COMMENT_HEADER_SELECTOR = ".comment__header";
const COMMENT_BODY_SELECTOR = ".comment__body";
const COMMENT_FOOTER_SELECTOR = ".comment__footer";
const COMMENT_CHILDREN_SELECTOR = ".comment__children";
const COMMENTS_ID = "comments";
const COMMENTS = document.getElementById(COMMENTS_ID)!;
const TEMPLATE_ID = "comment";
const TEMPLATE = document.getElementById(TEMPLATE_ID) as HTMLTemplateElement;

enum COMMENT_ACTIONS {
	REPLY = "REPLY",
	EDIT = "EDIT",
	DELETE = "DELETE",
}

const populateCommentWithData = (
	element: HTMLDivElement,
	comment: IComment,
	children: HTMLDivElement[]
) => {
	element.setAttribute("data-id", comment.id.toString());
	element.querySelector(COMMENT_HEADER_SELECTOR)!.innerHTML = `<strong>${
		comment.author.fullname
	}</strong> &bull; <span>${comment.createdOn.toISOString()}</span>`;
	element.querySelector(COMMENT_BODY_SELECTOR)!.textContent = comment.body;
	element.querySelector(
		COMMENT_FOOTER_SELECTOR
	)!.innerHTML = `<span data-action="${COMMENT_ACTIONS.REPLY}" data-commentid="${comment.id}">Reply</span>  | <span data-action="${COMMENT_ACTIONS.EDIT}" data-commentid="${comment.id}">Edit</span> | <span data-action="${COMMENT_ACTIONS.DELETE}" data-commentid="${comment.id}">Delete</span>`;
	children.forEach((child) => {
		element.querySelector(COMMENT_CHILDREN_SELECTOR)?.appendChild(child);
	});
};

const createComment = () => {
	const element = document.importNode(TEMPLATE, true).content;
	return element.firstElementChild as HTMLDivElement;
};

const createComments = (comments: IComment[]) => {
	return comments.map((comment) => {
		const element = createComment();
		const children = createComments(comment.comments || []);
		populateCommentWithData(element, comment, children);
		return element;
	});
};

const renderComments = (comments: IComment[]) => {
	COMMENTS.innerHTML = "";
	const elements = createComments(comments);
	elements.forEach((comment) => {
		COMMENTS?.appendChild(comment);
	});
};

const findComment = (
	comments: IComment[] = [],
	id: number
): [IComment, IComment[]] | null => {
	for (const comment of comments) {
		if (comment.id === id) return [comment, comments];

		const data = findComment(comment.comments, id);
		if (data) return data;
	}

	return null;
};

export const onComment: TonComment = (body, id, parentid) => {
	const event = new CustomEvent<TCommentEvent>("comments", {
		detail: {
			body,
			id,
			parentid,
		},
	});
	COMMENTS.dispatchEvent(event);
};

export const init = (
	resetForm: TresetForm,
	initComments: IComment[],
	owner: IComment["author"]
) => {
	renderComments(initComments);
	resetForm();

	COMMENTS.addEventListener("click", (e: MouseEvent) => {
		const { action, commentid: _commentId } = (e.target as HTMLSpanElement)
			.dataset;

		const id = +(_commentId || Date.now());
		const parentid = +(_commentId || "-1");

		if (action === COMMENT_ACTIONS.REPLY) {
			resetForm({ parentid });
		} else if (action === COMMENT_ACTIONS.EDIT) {
			const [comment] = findComment(initComments, id)!;
			const { body } = comment;
			resetForm({ id, body });
		} else if (action === COMMENT_ACTIONS.DELETE) {
			const data = findComment(initComments, id);
			if (data) {
				const [comment, comments] = data;
				const index = comments.findIndex((comm) => comment === comm);
				comments.splice(index, 1);

				renderComments(initComments);
			}
		}
	});

	// @ts-ignore
	COMMENTS.addEventListener<TCommentsEventMap>(
		"comments",
		(e: CustomEvent<TCommentEvent>) => {
			const { body, id, parentid } = e.detail;

			const data = findComment(initComments, id);
			const isEdit = !!data;
			if (isEdit) {
				const [comment] = data;
				comment.body = body;
				comment.updatedOn = new Date();
			} else {
				const newComment: IComment = {
					id,
					author: owner,
					body,
					createdOn: new Date(),
					updatedOn: new Date(),
				};
				const data = findComment(initComments, parentid);
				if (data) {
					const [comment] = data;
					comment.comments = comment.comments || [];
					comment.comments.push(newComment);
				} else {
					initComments.push(newComment);
				}
			}
			renderComments(initComments);
		}
	);
};
