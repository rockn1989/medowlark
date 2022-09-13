import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Vacations from "./vacations";
import logo from './img/logo.png';
import './App.css';

function Home() {
  return (
    <div>
      <h2>Добро пожаловать на Meadowlark Travel</h2>
      <p>Посетите нашу страницу <Link to="/about">О нас</Link></p>
    </div>
  );
};

function About() {
  return ('test')
}

function NotFound() {
  return ('NotFound');
}

function App() {
  return (
    <Router>

        <div className="container">
          <header>
            <Link to="/"><img src={logo} alt="logo" /></Link>
          </header>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
            <Route path="/vacations" exact component={Vacations} />
            <Route component={NotFound} />
          </Switch>
        </div>

    </Router>
  );
}

export default App;
