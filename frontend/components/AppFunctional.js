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


  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  // 
  function move(evt, direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    if(direction === "left") {
      if(index === 0 || index === 3 || index === 6) {
        setMessage("You can't go left");
      } else {
        setIndex(index - 1);
      }
    } else if(direction === "right") {
      if(index === 2 || index === 5 || index === 8) {
        setMessage("You can't go right");
      } else {
        setIndex(index + 1);
      }
    } else if(direction === "up") {
      if(index < 3) setMessage("You can't go up");
      else setIndex(index - 3);
    } else {
      if(index > 5) setMessage("You can't go down");
      else setIndex(index + 3);
    }
    if(message === "") setSteps(steps + 1);
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
        <h3 id="steps">You moved 0 times</h3>
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
