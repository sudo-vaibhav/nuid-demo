import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import SignUp from './components/SignUp/SignUp'
import LogIn from './components/LogIn/LogIn'

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || '{"user" : {"name" :""}}').user,
    // JSON.parse(localStorage.getItem('user') || '{}'),
  )
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand">NuID</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link className="nav-link" to="/">
                  Home
                </Link>
                <Link className="nav-link" to="/signup">
                  Sign up
                </Link>
                <Link to="/login" className="nav-link">
                  Log In
                </Link>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="mr-2">
                {user.name ? (
                  <div>
                    logged in as &nbsp;
                    {user.name}
                  </div>
                ) : (
                  <div>Not logged in</div>
                )}
              </span>
              <button
                className="btn btn-primary"
                disabled={!user.name}
                onClick={() => {
                  localStorage.removeItem('jwt')
                  localStorage.removeItem('user')
                  setUser({})
                  alert('logged out')
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <Switch>
          <Route path="/" exact>
            <div>
              <div className="jumbotron">
                <h1>Welcome to NuID auth 👋</h1>
                {user.name ? (
                  <div class="card">
                    <div class="card-body">
                      <p class="card-text">
                        name : <h3>{user.name}</h3>
                        email:
                        <h3>{user.email}</h3>
                        nuid:
                        <h6>{user.nuid}</h6>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>Login in now to see your details</div>
                )}
              </div>
            </div>
          </Route>
          <Route path="/signup" exact>
            <SignUp />
          </Route>
          <Route path="/login" exact>
            <LogIn />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
