import React from "react"
import { createMachine } from "xstate"

const timerMachine = createMachine({
  id: "timer-machine",
  initial: "",
})

const Timer = () => {
  return (
    <div>
      <p>bobobo</p>
    </div>
  )
}

export default Timer
