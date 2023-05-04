import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [boatInput, setBoatInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boat: boatInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
    console.log(response)
      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Name my boat</title>
        <link rel="icon" href="/boat.png" />
      </Head>

      <main className={styles.main}>
        <img src="/boat.png" className={styles.icon} />
        <h3>Name my boat</h3>
        <form onSubmit={onSubmit}>
          <h4> Enter words to inspire your boat's name </h4>
          <input
            type="text"
            name="boat"
            placeholder="The theme of your boat's name"
            value={boatInput}
            onChange={(e) => setBoatInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <br />
        {result ? <b style={{color: "gray"}}> Results </b> : ""}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
