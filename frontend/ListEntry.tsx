import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import InputGroupComponent from "frontend/InputGroupSm.tsx";
import ModalBody from "frontend/ModalBody.tsx";


type Props = {
    actors?: string,
    awards?: string,
    checked?: boolean,
    country?: string,
    director?: string,
    finished?: boolean,
    genre?: string,
    id: string,
    imdbID?: string,
    imdbRating?: string,
    imdbVotes?: string,
    language?: string,
    mark: string,
    metascore?: string,
    plot?: string,
    poster?: string,
    rated?: string,
    ratings?: string[],
    runtime?: number,
    seasons: boolean[],
    title: string,
    total_seasons: number,
    writer?: string,
    year_from?: number,
    year_to?: number,
}


@template<Props>((props) =>
	<div>
		<li class="list-group-item">
			<select class="custom-select" style="max-width:9%;" id="select-mark" value={ props.mark }>
				<option class="dropdown-item" value="f">f</option>
				<option class="dropdown-item" value="n">n</option>
				<option class="dropdown-item" value="!">!</option>
				<option class="dropdown-item" value="?">?</option>
			</select>
			
			<input type="checkbox" checked={ props.seasons.every(el => el) }></input>
			<input type="checkbox" checked={ props.finished }></input>

			<a class="button-as-link" 
				data-bs-toggle="collapse" 
				href={ `#collapseInfo-${props.id}` }
				role="button" 
				aria-expanded="false" 
				aria-controls={ `collapseInfo-${props.id}` }>
				{ props.title }
			</a>
			<a data-bs-toggle="modal" 
				data-bs-target="#editEntryModal"
				data-bs-placement="top"
				title="Edit Entry">
				✍
			</a>

			{ props.$.seasons.$.map((_, index) => <input type="checkbox" checked={ props.$.seasons.$[index] } />) }

			<div class="collapse" id={ `collapseInfo-${props.id}` }>
				<div class="card w-100">
					<div class="d-flex">
						<img src={props.poster} alt="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg" />
						<div class="card-body">
							<h5 class="card-title">{props.title}</h5>
							<p class="card-text">{props.plot}</p>
							<ul class="list-group list-group-flush">
								<li class="list-group-item"><b>Country: </b>{ props.country }</li>
								<li class="list-group-item"><b>Language: </b>{ props.language }</li>
								<li class="list-group-item"><b>Genre: </b>{ props.genre }</li>
								<li class="list-group-item"><b>Year: </b>{ props.year_from } - { props.year_to }</li>
								<li class="list-group-item"><b>Runtime: </b>{ props.runtime }</li>
								{/* <li class="list-group-item"><b>Total Seasons: </b>{ props.total_seasons }</li> */}
								<li class="list-group-item"><b>Finished: </b>{ props.finished ? 'Yes' : 'No' }</li>
							</ul>
						</div>
					</div>
					<ul class="list-group list-group-flush">
						{props.actors != "N/A" && <li class="list-group-item"><b>Actors: </b>{props.actors}</li>}
						{props.awards != "N/A" && <li class="list-group-item"><b>Awards: </b>{props.awards}</li>}
						{props.director != "N/A" && <li class="list-group-item"><b>Director: </b>{props.director}</li>}
						{props.imdbID != "N/A" && <li class="list-group-item"><b>IMDB ID: </b>{props.imdbID}</li>}
						{props.imdbRating != "N/A" && <li class="list-group-item"><b>IMDB Rating: </b>{props.imdbRating}</li>}
						{props.imdbVotes != "N/A" && <li class="list-group-item"><b>IMDB Votes: </b>{props.imdbVotes}</li>}
						{props.metascore != "N/A" && <li class="list-group-item"><b>Metascore: </b>{props.metascore}</li>}
						{props.rated != "N/A" && <li class="list-group-item"><b>Rated: </b>{props.rated}</li>}
						{props.writer != "N/A" && <li class="list-group-item"><b>Writer: </b>{props.writer}</li>}
					</ul>
					<div class="card-body">
						<a href="#" class="card-link">Card link</a>
						<a href="#" class="card-link">Another link</a>
					</div>
					</div>
			</div>
			
			<div class="modal fade" 
				id="editEntryModal" 
				tabindex="-1" 
				role="dialog" 
				aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="editEntryModal">Edit Entry</h5>
							<button type="button" 
								class="close" 
								data-bs-dismiss="modal" 
								aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							{/* <img src={ props.poster } alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img> */}
								<form>
									<div class="form-group">
										<label for="exampleForm">Upload A Poster</label>
										<input type="file" class="form-control-file" id="exampleForm" />
									</div>
								</form>

							<InputGroupComponent for="Title" type="text" value={props.title} />
							<InputGroupComponent for="Total Seasons" type="number" value={props.total_seasons} />
							<InputGroupComponent for="Year From" type="number" value={props.year_from} />
							<InputGroupComponent for="Year To" type="number" value={props.year_to} />
							<InputGroupComponent for="Runtime" type="number" value={props.runtime} />
							<InputGroupComponent for="Genre" type="text" value={props.genre} />
							<InputGroupComponent for="Country" type="text" value={props.country} />
							<InputGroupComponent for="Language" type="text" value={props.language} />

							<InputGroupComponent for="Actors" type="text" value={props.actors} />
							<InputGroupComponent for="Awards" type="text" value={props.awards} />
							<InputGroupComponent for="Director" type="text" value={props.director} />
							<InputGroupComponent for="IMDB ID" type="text" value={props.imdbID} />
							<InputGroupComponent for="IMDB Rating" type="text" value={props.imdbRating} />
							<InputGroupComponent for="IMDB Votes" type="text" value={props.imdbVotes} />
							<InputGroupComponent for="Metascore" type="text" value={props.metascore} />
							<InputGroupComponent for="Plot" type="text" value={props.plot} />
							<InputGroupComponent for="Rated" type="text" value={props.rated} />
							<InputGroupComponent for="Writer" type="text" value={props.writer} />

							<InputGroupComponent for="Finished" type="checkbox" value={props.finished} />
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close
							</button>
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
						</div>
					</div>
				</div>
			</div>
		</li>
	</div>
)

@style(css `
	li {
		list-style-type: none;
	}
`)

export class ListEntry extends Component<Props> {}


// li:has(input:checked) {
// 	text-decoration: line-through;
// }