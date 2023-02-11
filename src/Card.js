import React, { useEffect, useState } from 'react';
import range from 'lodash/range';
import Immutable from 'immutable';
import './Card.css';

const STATE = {
  PARS: 'pars',
  SCORES: 'scores',
  PLAYERS: 'players'
}

export function Scorecard(props) {

  // local storage items
  const [pars, setPars] = useState(JSON.parse(localStorage.getItem(STATE.PARS)) || Array(18).fill(3));
  useEffect(() => {
    localStorage.setItem(STATE.PARS, JSON.stringify(pars));
  }, [pars]);

  const [players, setPlayers] = useState(Immutable.List(JSON.parse(localStorage.getItem(STATE.PLAYERS))) || Immutable.List());
  useEffect(() => {
    localStorage.setItem(STATE.PLAYERS, JSON.stringify(players));
  }, [players]);

  const newScore = {};
  const [scores, setScores] = useState(Immutable.Map(JSON.parse(localStorage.getItem(STATE.SCORES))) || Immutable.Map(newScore));
  useEffect(() => {
    localStorage.setItem(STATE.SCORES, JSON.stringify(scores));
  }, [scores]);

  const [newPlayer, setNewPlayer] = useState('');
  const [newPlayerError, setNewPlayerError] = useState('');

  function getPlayers() {
    const elems = [];
    players.forEach(player => {
      elems.push(<th>{player}</th>);
    });
    return elems;
  }

  function updatePars(hole, par) {
    const newPars = [...pars];
    newPars[hole] = par;
    setPars(newPars);
  }

  function getScores(hole) {
    const elems = [];
    players.forEach(player => {
      elems.push(
        <td>
          <input
            type="number"
            className="score"
            value={scores.get(player)?.[hole] || ''}
            onChange={evt => updateScores(hole, player, parseInt(evt.target.value))}>
          </input>
        </td>);
    });
    return elems;
  }

  function updateScores(hole, player, score) {
    let newScores;
    if (scores.has(player)) {
      newScores = [...scores.get(player)];
    } else {
      newScores = Array(18).fill(0);
    }
    newScores[hole] = score;
    setScores(scores.set(player, newScores));
  }

  function getFinalScores() {
    const elems = [];
    players.forEach(player => {
      const playerScores = scores.get(player);
      let finalScore;
      if (!playerScores || playerScores.every(elem => !elem)) {
        finalScore = '';
      } else {
        finalScore = playerScores.reduce((sum, elem) => sum + elem, 0);
      }

      elems.push(
        <td>
          {finalScore}
        </td>
      );
    });
    return elems;
  }

  function addNewPlayer() {
    if (newPlayer) {
      // add new player
      setPlayers(players.push(newPlayer));

      // reset new player UI
      setNewPlayer("")
      setNewPlayerError("");
    } else {
      setNewPlayerError("Please enter a name!");
    }
  }

  function reset() {
    setPars(Array(18).fill(3));
    setScores(Immutable.Map(newScore));
    setPlayers(Immutable.List());
    setNewPlayer("");
    setNewPlayerError("");
  }

  return (
    <div>
      <h1>Simple Golf</h1>
      <div>
        <table>
          <tbody key="table">
            <tr key="title">
              <th>Hole</th>
              <th>Par</th>
              {getPlayers()}
              <th rowSpan="0" className="addPlayerCol">
                <input
                  type="text"
                  className="playerName"
                  value={newPlayer}
                  onChange={evt => setNewPlayer(evt.target.value)}></input><br />
                <button className="addPlayer" onClick={addNewPlayer}>Add Player</button><br />
                <p className="addPlayerError">{newPlayerError}</p>
              </th>
            </tr>
            {
              range(0, 18).map(i =>
                <tr key={`hole${i}`}>
                  <td>{i + 1}</td>
                  <td>
                    <input
                      type="number"
                      className="score"
                      value={pars[i] || ''}
                      onChange={evt => updatePars(i, parseInt(evt.target.value))}
                    ></input>
                  </td>
                  {getScores(i)}
                </tr>
              )
            }
            <tr key="final">
              <td>Final</td>
              <td>
                {pars.reduce((sum, elem) => sum + elem, 0) || ''}
              </td>
              {getFinalScores()}
            </tr>
          </tbody>
        </table>
        <button className="reset" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}