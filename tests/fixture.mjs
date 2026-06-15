import { onExit } from "signal-exit";

onExit(() => {
  console.log("process exited!");
}, { alwaysLast: true });