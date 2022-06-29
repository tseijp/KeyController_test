import * as React from "react";
import styled from "styled-components";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Controller, useCtrl, useStore } from "./hooks";

const Wrap = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  font-size: 2rem;
  text-align: center;
  align-items: center;
  vertical-align: center;
  justify-content: center;
  background: #212121;
  color: #00e2e2;
`;

class KeyController extends Controller {
  // keydown = (e) => console.log(e.key);
  keydown = (e) => this.state(e.key, e);

  effect() {
    this.state.add({ Enter: () => console.log("HI") });
    if (super.effect()) window.addEventListener("keydown", this.keydown);
  }

  clean() {
    if (super.clean()) window.removeEventListener("keydown", this.keydown);
  }
}

const KeyContext = React.createContext({});
const KeyProvider = KeyContext.Provider;
const useKeyContext = () => React.useContext(KeyContext);
const useKey = (...args) => useStore(useKeyContext(), ...args);

function Key(props) {
  const { children, ...other } = props;
  const state = useCtrl(KeyController, other);
  return <KeyProvider value={state} children={children} />;
}

function KeyInput() {
  const [key, setKey] = React.useState("");
  useKey("Enter", (_, arg = " ") => setKey((p) => p + arg) || true);
  useKey("a", (_, arg = "a") => setKey((p) => p + arg) || true);
  useKey({ a: (_, arg = "a") => setKey((p) => p + arg) || true });
  return <div>{key || "PRESS KEYBOARD"}</div>;
}

const A = () => void useKey("a", (...args) => console.log(...args));
// const A = () => void useKey("a", (key) => key(" ", "a")) || "";
// const B = () => void useKey("b", (key) => key(" ", "b")) || "";
// const C = () => void useKey("c", (key) => key(" ", "c")) || "";
// const D = () => void useKey("d", (key) => key(" ", "d")) || "";
// const E = () => void useKey("e", (key) => key(" ", "e")) || "";
// const F = () => void useKey("f", (key) => key(" ", "f")) || "";
// const G = () => void useKey("g", (key) => key(" ", "g")) || "";
// const H = () => void useKey("h", (key) => key(" ", "h")) || "";
// const I = () => void useKey("i", (key) => key(" ", "i")) || "";
// const J = () => void useKey("j", (key) => key(" ", "j")) || "";
// const K = () => void useKey("k", (key) => key(" ", "k")) || "";
// const L = () => void useKey("l", (key) => key(" ", "l")) || "";
// const M = () => void useKey("m", (key) => key(" ", "m")) || "";
// const N = () => void useKey("n", (key) => key(" ", "n")) || "";
// const O = () => void useKey("o", (key) => key(" ", "o")) || "";
// const P = () => void useKey("p", (key) => key(" ", "p")) || "";
// const Q = () => void useKey("q", (key) => key(" ", "q")) || "";
// const R = () => void useKey("r", (key) => key(" ", "r")) || "";
// const S = () => void useKey("s", (key) => key(" ", "s")) || "";
// const T = () => void useKey("t", (key) => key(" ", "t")) || "";
// const U = () => void useKey("u", (key) => key(" ", "u")) || "";
// const V = () => void useKey("v", (key) => key(" ", "v")) || "";
// const W = () => void useKey("w", (key) => key(" ", "w")) || "";
// const X = () => void useKey("x", (key) => key(" ", "x")) || "";
// const Y = () => void useKey("y", (key) => key(" ", "y")) || "";
// const Z = () => void useKey("z", (key) => key(" ", "z")) || "";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Wrap>
      <Key>
        <KeyInput />
        <A />
        {/* 
      <B />
      <C />
      <D />
      <E />
      <F />
      <G />
      <H />
      <I />
      <J />
      <K />
      <L />
      <M />
      <N />
      <O />
      <P />
      <Q />
      <R />
      <S />
      <T />
      <U />
      <V />
      <W />
      <X />
      <Y />
      <Z /> */}
      </Key>
    </Wrap>
  </StrictMode>
);
