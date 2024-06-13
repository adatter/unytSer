import { Component } from "uix/components/Component.ts";

// type Props = {
// 	id: number,
// 	type: string,
// 	amount: number,
// 	name: string,
// 	checked: boolean;
// };

type Props = {
	id: number,
    title: string,
    genre: string,
    year: [number, number],
    runtime: [number, number],
    country: string,
    language: string,
    total_seasons: number,
    seasones: boolean[],
    mark: string,
    finished: boolean,
	type: string,
	amount: number,
	name: string,
	checked: boolean;
}

@template<Props>((props) =>
	<li>
		<input type="checkbox" checked={ props.checked }></input>
		{ props.total_seasons } seasons of <b>{ props.title }</b>
	</li>
)

@style(css `
	li {
		list-style-type: none;
	}

	li:has(input:checked) {
		text-decoration: line-through;
	}
`)
export class ListEntry extends Component<Props> {};