import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";

import InputGroupComponent from "frontend/InputGroupSm.tsx";

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
	<div class="modal-body">
		<img src={props.poster} alt="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"></img>
			<form>
				<div class="form-group">
					<label for="exampleFormControlFile1">Upload A Poster</label>
					<input type="file" class="form-control-file" id="exampleFormControlFile1" />
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
)
class ModalBody extends Component<Props> {
    
}

export default ModalBody;