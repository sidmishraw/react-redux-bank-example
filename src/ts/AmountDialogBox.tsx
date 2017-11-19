/**
* AmountDialogBox.tsx
* @author Sidharth Mishra
* @description Amount entering dialog box
* @created Fri Nov 17 2017 23:42:26 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 23:42:26 GMT-0800 (PST)
*/

import * as React from "react";
import { map, reduceRight, filter } from "lodash";
import { ChangeEvent, FormEvent } from "react";

const { Component } = React;

//#region amount-dialog-box
interface AmountDialogBoxProps {
  changeHandler: Function;
  submitHandler: Function;
}
interface AmountDialogBoxState {}

export class AmountDialogBox extends Component<
  AmountDialogBoxProps,
  AmountDialogBoxState
> {
  props: AmountDialogBoxProps;
  state: AmountDialogBoxState;

  constructor(props: AmountDialogBoxProps, context?: any) {
    super(props);
  }

  private changeHandler(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    this.props.changeHandler(e.target.value);
  }

  private submit(e: Event) {
    this.props.submitHandler();
  }

  render() {
    return (
      <div>
        <label htmlFor="input">{"Enter your amount here: "}</label>
        <input type="text" name="amount" onChange={this.changeHandler.bind(this)} />
        {/* need to bind the change handlers since JS is not Java, this might refer to its
        closed over value */}
        <input type="submit" value="Go!" onClick={this.submit.bind(this)} />
      </div>
    );
  }
}
//#endregion
