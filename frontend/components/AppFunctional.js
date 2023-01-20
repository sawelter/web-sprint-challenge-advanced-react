// Todo - handle steps gracefully "You've moved 1 time" vs "You've moved 2 times"

import React, { useState } from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // (2,2) center

const URL = "http://localhost:9000/api/result";

export default function AppFunctional(props) {

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);


  // returns separate X and Y values as an object based on the current index
  function getXY() {
    const xyArray = [
      { x: 1, y: 1},
      { x: 2, y: 1},
      { x: 3, y: 1},
      { x: 1, y: 2},
      { x: 2, y: 2},
      { x: 3, y: 2},
      { x: 1, y: 3},
      { x: 2, y: 3},
      { x: 3, y: 3},
    ]
    return xyArray[index];
  }

  // Returns coordinates string displayed at top of screen
  function getXYMessage() {
    const coordinates = getXY();
    return `Coordinates (${coordinates.x}, ${coordinates.y})`
  }

  // Resets all values to initial
  function reset() {
    setEmail(initialEmail)
    setIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage);
  }

  // Move B to the left, or change the message to error if it cant be moved
  function moveLeft() {
    let idx = index;

    if(index !== 0 && index !== 3 && index !== 6) {
      idx = idx - 1;
      setSteps(steps + 1);
    } else {
      setMessage("You can't go left");
    }

    return idx;
  }

  // Move B to the right, or change the message to error if it cant be moved
  function moveRight() {
    let idx = index;

    if(index !== 2 && index !== 5 && index !== 8) {
      idx = idx + 1;
      setSteps(steps + 1);
    } else {
      setMessage("You can't go right");
    }

    return idx;
  }

  // Move B up, or change the message to error if it cant be moved
  function moveUp() {
    let idx = index;
    if(index > 2) {
      idx -= 3;
      setSteps(steps + 1);
    } else {
      setMessage("You can't go up");
    }
    return idx;
  }

  // Move B down, or change the message to error if it cant be moved
  function moveDown() {
    let idx = index;
    if(index < 6) {
      idx += 3;
      setSteps(steps + 1);
    } else {
      setMessage("You can't go down");
    }
    return idx;
  }

  // 
  function move(evt, direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();

    setMessage(initialMessage);

    if(direction === "left") {
      setIndex(moveLeft());
    } else if(direction === "right") {
      setIndex(moveRight());
    } else if(direction === "up") {
      setIndex(moveUp());
    } else if(direction === "down") {
      setIndex(moveDown());
    }
  }



  // Updates value of the email input.
  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
  }

  // Submits information to an API containing the current
  // index, number of steps, and valid email.
  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const coordinate = getXY();
    const newSubmission = {
      x: coordinate.x,
      y: coordinate.y,
      steps: steps,
      email: email,
    }
    axios.post(URL, newSubmission)
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => console.error(err));
    
      setEmail(initialEmail);
  }



  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps !== 1 ? "s" : ""}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} 
                 className={`square${idx === index ? ' active' : ''}`} >
                {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(e) => move(e, "left")}>LEFT</button>
        <button id="up" onClick={(e) => move(e, "up")}>UP</button>
        <button id="right" onClick={(e) => move(e, "right")}>RIGHT</button>
        <button id="down" onClick={(e) => move(e, "down")}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          id="email" 
          type="email" 
          placeholder="type email"
          onChange={(e) => onChange(e)}
          value={email}
        />
        <input 
          id="submit" 
          type="submit"
        />
      </form>
    </div>
  )
}
