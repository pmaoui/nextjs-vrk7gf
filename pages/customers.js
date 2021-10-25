import "semantic-ui-css/semantic.min.css";
import useSWR from "swr";
import {
  Segment,
  Icon,
  Loader,
  Dimmer,
  Table,
  Button,
  Message,
} from "semantic-ui-react";
import Router from "next/router";
import { useState } from "react";

export async function getOffers() {
  const res = await fetch("/api/customer-get-offers", {
    headers: { authorization: "Bearer " + localStorage.getItem("token") },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

const alreadyBought = {};

export default function Customers() {
  const { data, mutate, error } = useSWR("/api/customer-get-offers", getOffers);
  const [isBuying, setBuying] = useState(false);
  const [newWallet, setNewWallet] = useState(null);
  const offers = data && data.offers;
  const wallet = newWallet ? newWallet : data && data.wallet;

  const logout = () => {
    localStorage.removeItem("token");
    Router.push("/");
  };

  const buyIt = (offerId) => async () => {
    setBuying(true);
    alreadyBought[offerId] = true;
    const res = await fetch("/api/customer-buy-offer", {
      method: "POST",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offerId,
      }),
    });
    const { wallet } = await res.json();
    setNewWallet(wallet);
    setBuying(false);
    mutate();
  };

  if (error && error.toString().includes("jwt")) {
    Router.push("/");
  }

  return (
    <>
      <Segment>
        <h1>
          Welcome Customer 💸
          <Button onClick={logout} style={{ float: "right" }}>
            <Icon name="sign-out" />
          </Button>
        </h1>
        {data && (
          <h2>You got {Math.round(wallet * 100) / 100} (XPR) in your wallet</h2>
        )}
      </Segment>
      {!error && (!offers || isBuying) ? (
        <Dimmer inverted className="loading">
          <Loader inverted />
        </Dimmer>
      ) : offers && offers.length ? (
        <Table compact="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Fruit name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Price per fruit</Table.HeaderCell>
              <Table.HeaderCell>Total price (XPR)</Table.HeaderCell>
              <Table.HeaderCell>-</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {(offers || []).map((o, i) => {
              const notEnoughMoney = wallet < o.totalPrice;
              const isAlreadyBought = !!o.soldTo;
              return (
                <Table.Row key={i}>
                  <Table.Cell>{o.fruitName}</Table.Cell>
                  <Table.Cell>{o.fruitQuantity}</Table.Cell>
                  <Table.Cell>{o.fruitUnitPriceEUR}</Table.Cell>
                  <Table.Cell>{o.totalPrice}</Table.Cell>
                  <Table.Cell>
                    {(() => {
                      switch (true) {
                        case isAlreadyBought || alreadyBought[o.id]:
                          return (
                            <p>
                              Already bought {!!o.soldTo && `by ${o.soldTo}`}
                            </p>
                          );
                        case notEnoughMoney:
                          return <p>Not enough money</p>;
                        default:
                          return (
                            <Button primary onClick={buyIt(o.id)}>
                              BUY IT
                            </Button>
                          );
                      }
                    })()}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <Segment>
          <h3>Sorry</h3>
          No fruits available right now, please come back later :)
        </Segment>
      )}
      {error && <Message error header="Erreur" content={error.message} />}
    </>
  );
}
