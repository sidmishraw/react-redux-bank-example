/**
* AccountListing.tsx
* @author Sidharth Mishra
* @description AccountListing is the drop-down list component displaying account names
* @created Fri Nov 17 2017 23:41:48 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 23:41:48 GMT-0800 (PST)
*/

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as jQuery from "jquery";
import { map, filter, reduceRight } from "lodash";
import { Account } from "./Bank";
import { ChangeEvent } from "react";

const { Component } = React;

//#region bank-account-list-item
interface AccountListItemProps {
  name: string;
}
interface AccountListItemState {}

export class AccountListItem extends Component<
  AccountListItemProps,
  AccountListItemState
> {
  public props: AccountListItemProps;
  public state: AccountListItemState;

  public constructor(props: AccountListItemProps, context?: any) {
    super(props);
  }

  public render() {
    return <option value={this.props.name}>{this.props.name}</option>;
  }
}

//#endregion

//#region bank-account-list
interface AccountListingProps {
  accountNames: string[];
  selectHandler: Function;
}
interface AccountListingState {
  accountNames: string[];
}

export class AccountListing extends Component<AccountListingProps, AccountListingState> {
  public props: AccountListingProps;
  public state: AccountListingState;

  private listitems: JSX.Element[]; // the list items

  public constructor(props: AccountListingProps, context?: any) {
    super(props);
    this.state = { accountNames: this.props.accountNames };
    this.createListItems();
  }

  /**
   * Creates the list items from the state data
   */
  private createListItems() {
    this.listitems = map(this.state.accountNames, (accName: string): JSX.Element => (
      <AccountListItem key={accName} name={accName} />
    ));
  }

  public componentWillUpdate() {
    this.createListItems();
  }

  public componentWillMount() {
    this.createListItems();
  }

  private selecthandler(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    this.props.selectHandler(e.target.value);
  }

  public render() {
    return (
      <div>
        <label htmlFor="select">{"Select an account"}</label>
        <select onChange={this.selecthandler.bind(this)}>
          <option value="">{"-Select an account-"}</option>
          {this.listitems}
        </select>
      </div>
    );
  }
}
//#endregion
