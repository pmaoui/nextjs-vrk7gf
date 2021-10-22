import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import style from '../styles/Home.module.css';

export default function Home() {
  const logMeIn = async e => {
    e.preventDefault();
    const email = e.target.email.value
    const password = e.target.password.value

    const res = await fetch(
      '/api/login',
      {
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
    const alors = await res.json()
    console.log(alors)

  }

  return (
    <div
      className={`${style.authBackground} ui center aligned middle aligned grid`}
    >
      <div className={`ui card column ${style.authForm}`}>
        <div className="content">
          <div className="header left aligned">FruitPlace 🍏🍌🥝🍒</div>
          <div className="description">
            <form onSubmit={logMeIn} className="ui form">
              <div className="field left aligned">
                <div className="ui fluid input">
                  <input name="email" type="text" aria-invalid="true" placeholder="Email" />
                </div>
                <div
                  className="ui pointing above prompt label"
                  role="alert"
                  aria-atomic="true"
                >
                  Please enter your account email
                </div>
              </div>
              <div className="field">
                <div className="ui right corner labeled input">
                  <div className="ui label label right corner">
                    <i aria-hidden="true" className="asterisk icon"></i>
                  </div>
                  <input name="password" type="password" placeholder="Password" />
                </div>
              </div>
              <Button type="submit" className={`ui button primary ${style.PrimaryButton}`}>
                Log me in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
