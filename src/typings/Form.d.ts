import { TonComment } from "./Comment.d";

export type TFormInit = (onComment: TonComment) => void;
export type TresetForm = ({
	id,
	parentid,
	body,
}?: {
	id?: number | undefined;
	parentid?: number | undefined;
	body?: string;
}) => void;
