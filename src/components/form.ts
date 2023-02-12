import { TFormInit, TresetForm } from "../typings/Form.d";

const FORM_ID = "comment-form";
const FORM = document.getElementById(FORM_ID)!;
const FORM_BODY_SELECTOR = "textarea[name='body']";
const FORM_BODY = FORM.querySelector(FORM_BODY_SELECTOR) as HTMLTextAreaElement;

export const resetForm: TresetForm = ({
	id = Date.now(),
	parentid = -1,
	body = "",
} = {}) => {
	FORM.setAttribute("data-id", id.toString());
	FORM.setAttribute("data-parentid", parentid.toString());
	FORM_BODY.value = body;
};

export const init: TFormInit = (onComment) => {
	FORM.addEventListener("submit", (e: SubmitEvent) => {
		e.preventDefault();
		const body = FORM_BODY.value;
		const { id = Date.now(), parentid = -1 } = FORM.dataset;

		onComment(body, +id, +parentid);

		resetForm();
	});
};
