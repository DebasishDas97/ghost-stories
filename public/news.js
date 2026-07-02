const eventSource = new EventSource("/api/news")

const liveContainer = document.getElementById("live-container")


// Handle live updates
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const story = data.story
  if(story) {
    liveContainer.textContent = story
  }
}

// Handle connection loss
eventSource.onerror = () => {
  console.log("Connection lost. Attempting to reconnect...")
}

