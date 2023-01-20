import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const URL = "http://localhost:9000/api/result";

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  getXY = () => {
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
    return xyArray[this.state.index];
  }

  getXYMessage = () => {
    const coordinates = this.getXY();
    return `Coordinates (${coordinates.x}, ${coordinates.y})`
  }

  reset = () => {
    this.setState = initialState;
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const { value } = evt.target;
    this.setState({email: value});
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const coordinate = this.getXY();
    const newSubmission = {
      x: coordinate.x,
      y: coordinate.y,
      steps: this.state.steps,
      email: this.state.email,
    }
    axios.post(URL, newSubmission)
      .then(res => {
        this.setState({message: res.data.message})
      })
      .catch(err => console.error(err));
    
      this.setState({email: initialEmail})
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} time {this.state.steps === 1 ? "" : "s"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => this.move(e, "left")}>LEFT</button>
          <button id="up" onClick={(e) => this.move(e, "up")}>UP</button>
          <button id="right" onClick={(e) => this.move(e, "right")}>RIGHT</button>
          <button id="down" onClick={(e) => this.move(e, "down")}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onClick={this.onSubmit}>
          <input 
            id="email" 
            type="email" 
            placeholder="type email"
            onChange={this.onChange}
            value={this.state.email}
          />
          <input 
            id="submit" 
            type="submit"
          />
        </form>
      </div>
    )
  }
}
