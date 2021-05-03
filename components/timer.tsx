import styled from "@emotion/styled"
import { useMachine } from "@xstate/react"
import { motion } from "framer-motion"
import React, { useEffect } from "react"
import { assign, createMachine } from "xstate"

interface TimerMachineContext {
  duration: number
  elapsed: number
  interval: number
}

type TimerEvents = { type: "TOGGLE" } | { type: "TICK" }

const timerMachine = createMachine<TimerMachineContext, TimerEvents>(
  {
    id: "timerMachine",
    initial: "idle",
    context: {
      duration: 20,
      elapsed: 0,
      interval: 0.1,
    },
    states: {
      idle: {
        entry: "resetTimer",
        on: {
          TOGGLE: {
            target: "running",
          },
        },
      },
      running: {
        always: {
          target: "expired",
          cond: "timerExpired",
        },
        on: {
          TICK: {
            actions: "tick",
          },
          TOGGLE: {
            target: "paused",
          },
        },
      },
      paused: {
        on: {
          TOGGLE: { target: "running" },
        },
      },
      expired: {
        always: {
          target: "idle",
        },
      },
    },
  },
  {
    actions: {
      tick: assign<TimerMachineContext, Pick<TimerEvents, "type">>({
        elapsed: ctx => ctx.elapsed + ctx.interval,
      }),
      resetTimer: assign({
        duration: 20,
        elapsed: 0,
        interval: 0.1,
      }),
    },
    guards: {
      timerExpired: (ctx: TimerMachineContext) => ctx.elapsed >= ctx.duration,
    },
  }
)

const TimerStyles = styled.section`
  width: 900px;
  margin: 2rem auto;
`

const Clock = styled(motion.div)`
  /*  */
`

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Button = styled(motion.button)`
  border: 2px solid #eaeaea;
  font-size: 1.2rem;
  border-radius: 4px;
  width: 8rem;
  height: 2.2rem;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  outline: none;
`

const renderTime = (duration: number) => duration.toFixed(2)

const Timer = () => {
  const [state, send] = useMachine(timerMachine)

  const { duration, elapsed, interval } = state.context

  useEffect(() => {
    if (state.value === "running") {
      const timerId = setInterval(() => {
        send("TICK")
      }, 1000 * interval)
      return () => {
        clearInterval(timerId)
      }
    }
  }, [interval, send, state.value])

  return (
    <TimerStyles>
      <Body>
        <p>{state.value}</p>

        <Button onClick={() => send("TOGGLE")} whileHover={{ scale: 1.1 }}>
          {state.value === "running" ? "pause" : "start"}
        </Button>

        <Clock
          animate={{ scale: state.value === "paused" ? 1.1 : 1 }}
          transition={{ duration: 0.5, flip: state.value === "paused" ? Infinity : 0 }}
        >
          <h3> {renderTime(duration - elapsed)}</h3>
        </Clock>
      </Body>
    </TimerStyles>
  )
}

export default Timer
