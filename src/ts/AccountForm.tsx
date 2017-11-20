/**
* AccountForm.tsx
* @author Sidharth Mishra
* @description Form for management of data
* @created Sat Nov 18 2017 14:56:59 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Sat Nov 18 2017 14:56:59 GMT-0800 (PST)
*/

import * as React from "react";
import { map, filter, reduceRight } from "lodash";
import { AccountListing } from "./AccountListing";
import { ActionPane } from "./ActionPane";
import { AmountDialogBox } from "./AmountDialogBox";
import { FormEvent, ChangeEvent, UIEvent } from "react";
import { Account, Action, ActionType, newAction } from "./Bank";
import { Event } from "_debugger";

const { Component } = React;

//#region account-form
interface AccountFormProps {
  accounts: Account[];
  actiontypes: string[];
  formHandler: Function;
}
class AccountFormState {
  accounts: Account[] = [];
  formSelections: FormSelections = new FormSelections();
}

class FormSelections {
  accountName: string = "";
  actionName: string = "";
  amount: string = "";
}

export class AccountForm extends Component<AccountFormProps, AccountFormState> {
  props: AccountFormProps;
  state: AccountFormState;

  constructor(props: AccountFormProps, context?: any) {
    super(props);
    this.state = new AccountFormState();
    this.state.accounts = this.props.accounts;
  }

  /**
   * Submit button handler
   */
  private submitHandler() {
    console.log("The submit button was clicked in the child component");
  }

  /**
   * Handles the form submit event
   * 
   * @param e The form submit event handler
   */
  private handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.formHandler(
      newAction(
        this.state.formSelections.actionName.toLowerCase() === "withdraw"
          ? ActionType.Withdraw
          : ActionType.Deposit,
        parseInt(this.state.formSelections.amount),
        this.state.formSelections.accountName
      )
    );
  }

  /**
   * The name of the account selected
   * 
   * @param selectedAccountName The account name that is selected
   */
  private accountListingSelectHandler(selectedAccountName: string) {
    this.state.formSelections.accountName = selectedAccountName;
  }

  /**
   * The handler for action type selection
   * 
   * @param actionTypeSelected The action selected - deposit or withdraw
   */
  private actionSelectionHandler(actionTypeSelected: string) {
    this.state.formSelections.actionName = actionTypeSelected;
  }

  /**
   * The amount of money to be deposited or withdrawn
   * 
   * @param textContent The amount entered in the text box
   */
  private amountboxChangeHandler(textContent: string) {
    this.state.formSelections.amount = textContent;
  }

  render() {
    return (
      <form action="#" onSubmit={this.handleFormSubmit.bind(this)}>
        <AccountListing
          accountNames={map(this.state.accounts, (acc: Account): string => acc.name)}
          selectHandler={this.accountListingSelectHandler.bind(this)}
        />
        <ActionPane
          actions={this.props.actiontypes}
          actionSelectionHandler={this.actionSelectionHandler.bind(this)}
        />
        <AmountDialogBox
          changeHandler={this.amountboxChangeHandler.bind(this)}
          submitHandler={this.submitHandler.bind(this)}
        />
      </form>
    );
  }
}

//#endregion
