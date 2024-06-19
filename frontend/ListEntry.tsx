import { Component } from "uix/components/Component.ts";
import { SeasonsEntry } from "./SeasonsEntry.tsx";

const infoModalVisible = $$(true);
const selectMarkVisible = $$(false);

function editEntry(id) {
	return 0
}

type Props = {
	id: number,
    title: string,
    genre?: string,
    year?: [number, number],
    runtime?: [number, number],
    country?: string,
    language?: string,
    total_seasons: number,
    seasons: boolean[],
    mark: string,
    finished: boolean,
	checked: boolean;
}

@template<Props>((props) =>
	<li>
		<button onclick={ () => selectMarkVisible.val = true }>{ props.mark }</button>
		<select style="max-width:5%;" id="select-mark" class={{ visible: selectMarkVisible }}>{ props.mark }
		<option value="">--Please choose an option--</option>
			<option value="f">f</option>
			<option value="n">n</option>
			<option value="!">!</option>
			<option value="?">?</option>
		</select>
		<input type="checkbox" checked={ props.checked }></input>

		<b>{ props.title }</b>

		{ props.seasons.$.map(seas => <input type="checkbox" checked={ seas }> seas </input>) }

		<div id="info-modal" class={{ visible: infoModalVisible }}>
				<ul>
					{ Object.entries(props).filter(([key, value]) => (key != "id") && (key != "mark") && (key != "seasons")).map(([key,value]) => <li><b>{ key }</b>: { value }</li>) }
				</ul>
				
				{ Object.entries(props).forEach(item => item) }
			Genre: { props.genre }
			Language: { props.language }
			Country: { props.language }

			div
		</div>

	</li>
)

@style(css `
	li {
		list-style-type: none;
	}
`)
export class ListEntry extends Component<Props> {};

// li:has(input:checked) {
// 	text-decoration: line-through;
// }