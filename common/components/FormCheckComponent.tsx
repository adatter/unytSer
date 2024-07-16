import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


@template<{str: string, checked: boolean, func: (s:string) => undefined}>(({str, checked, func}) => {
    return (
        <div class="form-check form-check-inline">
			<input class="form-check-input filter" type="checkbox" checked={ checked } onclick={ (str) => func(str) }/>
			<label class="form-check-label">{ str }</label>
		</div>
    );
})

export class FormCheckComponent extends Component<{for: string}> {};