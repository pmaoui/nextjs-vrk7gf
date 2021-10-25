import { Button, Form, Message } from "semantic-ui-react";
import { useState } from "react";
import Router from "next/router";

import "semantic-ui-css/semantic.min.css";
import style from "../styles/Home.module.css";

export default function Home() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const logMeIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    const call = await fetch("/api/login", {
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const res = await call.json();
    if (res.error) {
      setLoading(false);
      return setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      setTimeout(() => Router.push(`/${res.type}s`), 1000);
    }
  };

  return (
    <div
      className={`${style.authBackground} ui center aligned middle aligned grid`}
    >
      <div className={`ui card column ${style.authForm}`}>
        <div className="content">
          <div className="header left aligned">FruitPlace 🍏🍌🥝🍒</div>
          <div className="description">
            <Form
              loading={loading}
              error={!!error}
              onSubmit={logMeIn}
              className="ui form"
            >
              <div className="field left aligned">
                <div className="ui fluid input">
                  <input
                    name="email"
                    type="text"
                    aria-invalid="true"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="field">
                <div className="ui right corner labeled input">
                  <div className="ui label label right corner">
                    <i aria-hidden="true" className="asterisk icon"></i>
                  </div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
              </div>
              <Message error header="Error" content={error} />
              <Button
                disabled={loading}
                type="submit"
                className={`ui button primary ${style.PrimaryButton}`}
              >
                Log me in
              </Button>
            </Form>
          </div>
        </div>
        <Message>
          <h3>Known accounts:</h3>
          <p>john@farmer.com</p>
          <p>jack@farmer.com</p>
          <p>steve@farmer.com</p>
          <p>john@customer.com</p>
          <p>jack@customer.com</p>
          <p>steve@customer.com</p>
          <p>
            <strong>Password: password (everywhere)</strong>
          </p>
          <p>
            <strong>
              <a
                href="https://docs.google.com/spreadsheets/d/1OxV1I-qOfKT8HPa3FvQcosnWlIfKnue0hcNNXaENrSM/edit?usp=sharing"
                target="_blank"
              >
                Spreadsheet database
              </a>
            </strong>
            <i>
              <br />
              ￫ Feel free to add/delete/edit anything on it
            </i>
          </p>
        </Message>
      </div>
    </div>
  );
}
