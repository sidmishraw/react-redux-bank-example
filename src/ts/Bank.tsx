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
import * as ReduxStore from "./ReduxStore";
import { bankReducer } from "./ReduxStore";
import { createStore } from "redux";

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
export interface Action {
  type: ActionType;
  amt: number;
  accountName: string;
}

/**
* Creates an action.
* 
* @param type The type of action: `ActionType.Deposit` or `ActionType.Withdraw`
* @param amt The amount of money the action uses
* @param accountName The target account name of the action
*/
export const newAction = (type: ActionType, amt: number, accountName: string) => {
  let action = {
    type: ActionType.Deposit,
    amt: -1,
    accountName: ""
  };
  action.type = type;
  action.amt = amt;
  action.accountName = accountName;
  return action;
};

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
export interface AppProps {
  accounts: Account[];
  actiontypes: string[];
}

/**
 * Application State type
 */
export class AppState {
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
    // let redux handle the incoming action
    BankStateStore.dispatch(incomingAction);

    return BankStateStore.getState(); // get the current state after redux is done computing the new state
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
// Store creation logic
let initialStoreState = new AppState();
initialStoreState.accounts = ACCOUNTS;

export const BankStateStore = createStore(bankReducer, initialStoreState);

//Rendering logic
render(
  <Application
    accounts={BankStateStore.getState().accounts}
    actiontypes={["deposit", "withdraw"]}
  />,
  jQuery("#root").get(0)
);
