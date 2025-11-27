import React, { useEffect } from "react";
import {fetchList} from './api/apiClient'

export async function CallAPI(){
    const res = await fetchList(151,0)
    return res
}

export default function App() {

  useEffect(() => {
    const run = async () => {
      const result = await CallAPI();
      console.log("API result:", result);
    };
    run();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#616161ff",
      }}
    >
      <h1
        style={{
          margin: 0,
          textAlign: "center",
          fontSize: "1.75rem",
          fontWeight: 600,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        CallAPI()
      </h1>
    </div>
  );
}
