/**
* ReduxStore.tsx
* @author Sidharth Mishra
* @description The redux reducer and store are defined here
* @created Sun Nov 19 2017 20:19:27 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Sun Nov 19 2017 20:19:27 GMT-0800 (PST)
*/
//====================================================================================
import { Reducer, AnyAction } from "redux";
import { map, filter, reduceRight } from "lodash";
import { Action, AppState, ActionType } from "./Bank";
//====================================================================================

export const bankReducer: Reducer<AppState> = (
  currentAppState: AppState,
  incomingAction: Action
): AppState => {
  if (typeof incomingAction.type !== "number") return currentAppState; // init Action from Redux, let it pass through unmodified

  let matchingAccounts = filter(
    currentAppState.accounts,
    account => account.name === incomingAction.accountName
  );

  //only considering the first match in case of many -- this should never happen in the first case
  let matchingAccount = matchingAccounts.length > 0 ? matchingAccounts[0] : null;

  if (!matchingAccount)
    throw new Error("The account named " + incomingAction.accountName + " doesn't exist");

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
  newAppState.accounts = currentAppState.accounts;
  //# referneces are getting passed along -- not true functional way here

  console.log("New App State:: " + JSON.stringify(newAppState));

  return newAppState;
};
