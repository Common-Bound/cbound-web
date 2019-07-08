import React from "react";
import "./App.css";

function App() {
  const handleClick = e => {
    const url = "/users/1";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };

  return (
    <div className="App">
      <button onClick={handleClick}>button</button>
    </div>
  );
}

export default App;
