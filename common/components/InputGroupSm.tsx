import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


interface Props {
	for: string,
    type: string,
    value: any
}

@template(function(this: InputGroupComponent, props) {
    return (
        <li>
            <button type="button" 
                    class="button-as-text" 
                    data-toggle="tooltip" 
                    title="Click to edit" 
                    onclick={() => this.toggleDisabled()}>{ props.for }:</button>
            <input type={ props.type } class="input-group-component" value={ props.value } disabled={ this.$.isDisabled } style="display: inline-block; width: auto;" />
        </li>
    );
})


class InputGroupComponent extends Component<Props> {
    @property isDisabled = true;

    toggleDisabled() {
        this.isDisabled = !this.isDisabled;
    }
}


export default InputGroupComponent;