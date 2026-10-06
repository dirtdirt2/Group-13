import { useState } from 'react'
import EventList from "./components/EventList"
import EventDetailsUI from "./components/EventDetailsUI"

function App() {

  return (
    <>
      <EventList />
      <EventDetailsUI />
    </>
  )
}

export default App