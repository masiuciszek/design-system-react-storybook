import { useEffect, useState, KeyboardEvent } from "react"

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = ({ key, keyCode }): void => {
    console.log(key, keyCode)
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }
  const upHandler = ({ key }): void => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler)
    window.addEventListener("keyup", upHandler)

    return () => {
      window.removeEventListener("keydown", downHandler)
      window.removeEventListener("keyup", upHandler)
    }
  }, [])
  return keyPressed
}

export default useKeyPress
