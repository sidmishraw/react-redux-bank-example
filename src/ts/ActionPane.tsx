/**
* ActionPane.tsx
* @author Sidharth Mishra
* @description Drop down with the actions
* @created Fri Nov 17 2017 23:42:05 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 23:42:05 GMT-0800 (PST)
*/

import * as React from "react";
import { map } from "lodash";
import { ChangeEvent } from "react";

const { Component } = React;

//#region action-pane
interface ActionPaneProps {
  actions: string[];
  actionSelectionHandler: Function;
}
interface ActionPaneState {}

export class ActionPane extends Component<ActionPaneProps, ActionPaneState> {
  props: ActionPaneProps;
  state: ActionPaneState;

  private actions: JSX.Element[];

  constructor(props: ActionPaneProps, context?: any) {
    super(props);
  }

  componentWillMount() {
    this.createActionElements();
  }

  componentWillUpdate() {
    this.createActionElements();
  }

  private createActionElements() {
    this.actions = map(this.props.actions, (action: string): JSX.Element => (
      <option key={action} value={action}>
        {action}
      </option>
    ));
  }

  private actionSelectionhandler(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    this.props.actionSelectionHandler(e.target.value);
  }

  render() {
    return (
      <div>
        <label htmlFor="select">{"Select an action  "}</label>
        <select onChange={this.actionSelectionhandler.bind(this)}>
          <option value="">{"-Select an action to perform-"}</option>
          {this.actions}
        </select>
      </div>
    );
  }
}
//#endregion
