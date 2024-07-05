import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";


interface Props {
	for: string,
    type: string;
    value: any;
}

@template(function(this: InputGroupComponent, props) {
    return (
        <li>
            <button type="button" 
                    class="button-as-text" 
                    data-toggle="tooltip" 
                    title="Click to edit" 
                    onclick={() => this.toggleDisabled()}>{ props.for }:</button>
            <input type={ props.type } class="input-group-component" value={ props.value } disabled={this.$.isDisabled} style="display: inline-block; width: auto;" />
        </li>
    );
})

@style(css `
	input:disabled {
    border: none;
    background-color: transparent;
    color: inherit;
    cursor: text;
    };

    .input-group input-group-sm mb-3 {
    padding: 0px;
    margin: 0px;
    };

    .button-as-text {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    }

    .button-as-text:hover {
        text-decoration: underline;
        font-weight: bold;
        color: #555; /* or any lighter color you prefer */
    }

`)

class InputGroupComponent extends Component<Props> {
    @property isDisabled = true;

    toggleDisabled() {
        this.isDisabled = !this.isDisabled;
    }
}


export default InputGroupComponent;