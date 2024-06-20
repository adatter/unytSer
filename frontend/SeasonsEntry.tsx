import { Component } from "uix/components/Component.ts";

@template<boolean>((check: boolean) =>
    <input type="checkbox" checked={ check }></input>
)


export class SeasonsEntry extends Component<boolean> {};