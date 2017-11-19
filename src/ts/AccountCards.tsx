/**
* AccountCards.tsx
* @author Sidharth Mishra
* @description Account Cards display the account details on the UI
* @created Fri Nov 17 2017 23:42:35 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 23:42:35 GMT-0800 (PST)
*/

import { Account } from "./Bank";
import * as React from "react";
import { map, filter, reduceRight } from "lodash";

//#region account-card
/**
 * AccountCardProps
 * ------------------
 * The immutable props for the AccountCard component
 */
interface AccountCardProps {
  name: string;
  amt: number;
}
/**
 * AccountCardState
 * ------------------
 * The mutable state for the AccountCard component
 */
interface AccountCardState {}

export class AccountCard extends React.Component<AccountCardProps, AccountCardState> {
  public props: AccountCardProps;
  public state: AccountCardState;

  /**
   * Constructs a new AccountCard component
   * 
   * @param props The props for the new AccountCard
   * @param context The optional context
   */
  public constructor(props: AccountCardProps, context?: any) {
    super(props);
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  /**
   * renders the component
   */
  public render() {
    return (
      <tr>
        <td>
          <table style={{ border: "solid" }}>
            <tbody>
              <tr>
                {/* <td>{"Account Name"}</td> */}
                <td>{this.props.name}</td>
              </tr>
              <tr>
                {/* <td>{"Current Balance"}</td> */}
                <td>{"$ " + this.props.amt}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }
}
//#endregion

//#region account-cards
interface AccountCardsProps {
  accounts: Account[];
}
interface AccountCardsState {
  accounts: Account[];
}

/**
 * AccountCards
 * --------------
 * A container for AccountCard components
 */
export class AccountCards extends React.Component<AccountCardsProps, AccountCardsState> {
  public props: AccountCardsProps; // immutable props
  public state: AccountCardsState; // mutable state
  private accountCards: JSX.Element[]; // AccountCard components to be contained in this container

  constructor(props: AccountCardsProps, context?: any) {
    super(props);
    this.state = { accounts: this.props.accounts };
  }

  componentDidMount() {
    this.setState(this.state);
    this.createAccountCards();
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  /**
   * Called just before the component is going to be updated
   */
  componentWillUpdate() {
    this.createAccountCards();
  }

  /**
   * creates the account cards from the AccountCards' container's state
   */
  private createAccountCards() {
    // console.log("cAa" + JSON.stringify(this.state.accounts));
    this.accountCards = map(this.state.accounts, (account: Account): JSX.Element => (
      <AccountCard name={account.name} amt={account.balance} key={account.name} />
    ));
  }

  render() {
    return (
      <div>
        <table>
          <tbody>{this.accountCards}</tbody>
        </table>
      </div>
    );
  }
}
//#endregion
