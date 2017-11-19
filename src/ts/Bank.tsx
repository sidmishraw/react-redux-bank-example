/**
* bank.ts
* @author Sidharth Mishra
* @description bank application using react and redux
* @created Fri Nov 17 2017 22:59:18 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 22:59:18 GMT-0800 (PST)
*/

import * as React from "react";
import { render } from "react-dom";
import "jquery";
import { map, filter, reduceRight } from "lodash";
import { AccountCards } from "./AccountCards";
import { AccountListing } from "./AccountListing";
import { ActionPane } from "./ActionPane";
import { AmountDialogBox } from "./AmountDialogBox";
import { FormEvent } from "react";
import { AccountForm } from "./AccountForm";

//=================================================================================
/**
 * ### Account
 * ---
 * 
 * Represents the bank account
 */
export interface Account {
  name: string; // account name
  balance: number; // amount of balance in the account
}

/**
 * ActionType
 * -------------
 * * Deposit signifies a deposit action
 * * Withdraw signifies a withdraw action
 */
export enum ActionType {
  Deposit,
  Withdraw
}

/**
 * Represents a UI action.
 * 
 * Actions types are:
 * * `withdraw` - `false`
 * * `deposit` - `true`
 */
export class Action {
  public type: ActionType;
  public amt: number;
  public accountName: string;

  /**
   * Creates an action.
   * 
   * @param type The type of action: `ActionType.Deposit` or `ActionType.Withdraw`
   * @param amt The amount of money the action uses
   * @param accountName The target account name of the action
   */
  constructor(type: ActionType, amt: number, accountName: string) {
    this.type = type;
    this.amt = amt;
    this.accountName = accountName;
  }
}
// ================================================================================
/**
 * Initial state of the application
 */
const ACCOUNTS: Account[] = [
  {
    name: "Account 1",
    balance: 100.0
  },
  {
    name: "Account 2",
    balance: 500.0
  },
  {
    name: "Account 3",
    balance: 340.65
  }
];
// ================================================================================

/**
 * Application Property type
 */
interface AppProps {
  accounts: Account[];
  actiontypes: string[];
}

/**
 * Application State type
 */
class AppState {
  accounts: Account[] = [];
}
/**
 * Application
 * ---------------
 * The React component for the entire application.
 */
class Application extends React.Component<AppProps, AppState> {
  public props: AppProps;
  public state: AppState;

  constructor(props: AppProps) {
    super(props);
    this.state = new AppState();
    this.state.accounts = this.props.accounts;
  }

  /**
   * AccountForm submit handler's callback
   * 
   * @param action The action propagated up the V-DOM tree
   */
  private accountFormHandler(action: Action) {
    this.setState(this.handleAction(action));
  }

  /**
   * Handles the incoming action but updating the state of the application's UI
   * This should be the reducer that will give back the updated state when using Redux?
   * 
   * @param incomingAction The incoming action from the form submit
   */
  private handleAction(incomingAction: Action): AppState {
    let matchingAccounts = filter(
      this.state.accounts,
      account => account.name === incomingAction.accountName
    );

    //only considering the first match in case of many -- this should never happen in the first case
    let matchingAccount = matchingAccounts.length > 0 ? matchingAccounts[0] : null;

    if (!matchingAccount)
      throw new Error(
        "The account named " + incomingAction.accountName + " doesn't exist"
      );

    let currentBal = matchingAccount.balance;

    switch (incomingAction.type) {
      case ActionType.Deposit:
        matchingAccount.balance = currentBal + incomingAction.amt;
        break;
      case ActionType.Withdraw:
        matchingAccount.balance = currentBal - incomingAction.amt;
        break;
    }

    //# referneces are getting passed along -- not true functional way here
    let newAppState: AppState = new AppState();
    newAppState.accounts = this.state.accounts;
    //# referneces are getting passed along -- not true functional way here

    console.log("New App State:: " + JSON.stringify(newAppState));

    return newAppState;
  }

  render() {
    return (
      <div>
        <AccountCards accounts={this.state.accounts} />
        <AccountForm
          accounts={this.state.accounts}
          actiontypes={this.props.actiontypes}
          formHandler={this.accountFormHandler.bind(this)}
        />
      </div>
    );
  }
}

// ================================================================================
//Rendering logic
render(
  <Application accounts={ACCOUNTS} actiontypes={["deposit", "withdraw"]} />,
  jQuery("#root").get(0)
);
