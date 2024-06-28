import { Component } from "uix/components/Component.ts";
import { SeasonsEntry } from "./SeasonsEntry.tsx";
import { template } from "uix/html/template.ts";
import { items } from "backend/data.ts";

const seasonsComponent = template<{check:boolean}>(({check}) => <input type="checkbox" checked={ check }></input>)

const infoModalVisible = $$(false);
const selectMarkVisible = $$(false);

const visibleModals: string[] = $$(["5"]);


function showInfo(item) {
    switch (item[0]) {
        case "year":
            return item[1][0] + " to " + item[1][1];
        case "runtime":
            return item[1][0] + " - " + item[1][1] + " min";
        case "finished":
            return item[1] ? "yes" : "no";
    }
    return item[1];
}



function showInfoModal(event) {

	let id = event.target.id
	console.log(id);

	console.log(visibleModals)

	visibleModals.push(id.replace("info-btn-", ""))

	console.log(visibleModals.includes(id.replace("info-btn-", "")))
}


function editEntry(id) {
	return 0
}

type Props = {
	id: string,
    title: string,
    genre?: string,
    year_from?: number
	year_to?: number,
    runtime_from?: number,
	runtime_to?: number,
    country?: string,
    language?: string,
    total_seasons: number,
    seasons: boolean[],
    mark: string,
    finished: boolean,
	checked?: boolean,
}

@template<Props>((props: Props) =>
	<li>
		<select style="max-width:5%;" id="select-mark" class="visible">{ props.mark }
		<option value="">{ props.mark }</option>
			<option value="f">f</option>
			<option value="n">n</option>
			<option value="!">!</option>
			<option value="?">?</option>
		</select>
		<input type="checkbox" checked={ props.seasons.every(el => el) }></input>
		<input type="checkbox" checked={ props.finished }></input>

		<b class="button-as-link" id={ `info-btn-${props.id}` } onclick={ (event) => showInfoModal(event) }>{ props.title }</b>
		{ props.$.seasons.$.map((_, index) =>
			<input type="checkbox" checked={ props.$.seasons.$[index] } />
		) }

		<div id="info-modal" class={  { visible: visibleModals.includes(String(props.id)) }  }>
			<button>Edit Entry (inactive)</button>
				<ul>
					{ Object.entries(props).filter(([key, value]) => (key != "id") && (key != "mark") && (key != "seasons") && (key != "title")).map(([key, value]) => <li><b>{ key.charAt(0).toUpperCase() + key.slice(1).replace("_"," ") }: </b>{ showInfo([key, value]) }</li>) }
				</ul>
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