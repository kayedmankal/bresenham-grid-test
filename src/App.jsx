import Grid from "./components/Grid.jsx";
import Grid3D from "./components/Grid3D.jsx";
import React from "react";

function App() {


    const [is3D, set3D] = React.useState(false);

    return (

        <div>
            <button onClick={() => set3D(prev => !prev)}>
                Switch to: {is3D ? "2D" : "3D"}
            </button>
            <div>Select two cells</div>
            <div>
                {is3D ? <Grid3D /> : <Grid />}
            </div>
        </div>
    )
        }
export default App;
