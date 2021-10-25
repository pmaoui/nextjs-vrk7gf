import "semantic-ui-css/semantic.min.css";
import useSWR from "swr";
import {
  Form,
  Input,
  Button,
  Loader,
  Segment,
  Dimmer,
  Statistic,
  Icon,
} from "semantic-ui-react";
import { useState } from "react";
import Router from "next/router";

export async function getOffer() {
  const res = await fetch("/api/farmer-get-offer", {
    headers: { authorization: "Bearer " + localStorage.getItem("token") },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.offer;
}

export default function Farmers() {
  const { data: offer, error } = useSWR("/api/farmer-get-offer", getOffer);
  const [loadingSubmitOffer, setLoadingSubmitOffer] = useState(false);
  const [submittedOffer, setSubmittedOffer] = useState(null);
  const data = submittedOffer || offer;

  const deleteOffer = async () => {
    setLoadingSubmitOffer(true);
    await fetch("/api/farmer-remove-offer", {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      method: "POST",
    });
    location.reload();
  };

  const submitOffer = async (e) => {
    const fruitName = e.target.fruitName.value;
    const fruitUnitPriceEUR = e.target.fruitUnitPriceEUR.value;
    const fruitQuantity = e.target.fruitQuantity.value;
    setLoadingSubmitOffer(true);
    const call = await fetch("/api/farmer-set-offer", {
      body: JSON.stringify({ fruitName, fruitUnitPriceEUR, fruitQuantity }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      method: "POST",
    });
    const res = await call.json();
    setLoadingSubmitOffer(false);
    setSubmittedOffer(res);
  };

  const logout = () => {
    localStorage.removeItem("token");
    Router.push("/");
  };

  return (
    <div>
      <Segment>
        <h1>
          Welcome Farmer 🚜
          <Button onClick={logout} style={{ float: "right" }}>
            <Icon name="sign-out" />
          </Button>
        </h1>
      </Segment>
      {!data || loadingSubmitOffer ? (
        <Dimmer inverted className="loading">
          <Loader inverted />
        </Dimmer>
      ) : data.id ? (
        <Segment>
          <h2 style={{ float: "left", marginRight: "10px" }}>Your offer</h2>
          {offer.soldTo ? (
            <p style={{ clear: "left" }}>
              Congratulations 🎉 ! You have just sold your offer to {offer.soldTo}
            </p>
          ) : (
            <Button icon onClick={deleteOffer}>
              <Icon name="trash" />
            </Button>
          )}
          <Statistic.Group>
            <Statistic color="olive">
              <Statistic.Value>{data.fruitName}</Statistic.Value>
              <Statistic.Label>Fruit</Statistic.Label>
            </Statistic>
            <Statistic color="violet">
              <Statistic.Value>{data.fruitQuantity}</Statistic.Value>
              <Statistic.Label>Quantity</Statistic.Label>
            </Statistic>
            <Statistic color="red">
              <Statistic.Value>{data.fruitUnitPriceEUR}</Statistic.Value>
              <Statistic.Label>Price per unit</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>
      ) : (
        <Segment>
          <Form loading={loadingSubmitOffer} onSubmit={submitOffer}>
            <h2>New offer</h2>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                name="fruitName"
                label="Fruit name"
                placeholder="Ex: banana"
              />
              <Form.Field
                control={Input}
                name="fruitQuantity"
                label="Quantity"
                placeholder="Enter the quantity"
                type="number"
              />
              <Form.Field
                control={Input}
                name="fruitUnitPriceEUR"
                label="Price per fruit"
                type="number"
                placeholder="Enter the price per fruit"
              />
            </Form.Group>
            <Button type="submit">Submit offer</Button>
          </Form>
        </Segment>
      )}
    </div>
  );
}
