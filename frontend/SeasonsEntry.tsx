import { Component } from "uix/components/Component.ts";

type Props = {
    checked: boolean;
}

@template<Props>((props) =>
    <input type="checkbox" checked="true"></input>
)

export class SeasonsEntry extends Component<Props> {};