import classes from "./spinner.module.css";

function Spinner() {
  return (
    <>
      <div class={[classes.mult2rect, classes.mult2rect1].join(" ")}></div>
      <div class={[classes.mult2rect, classes.mult2rect2].join(" ")}></div>
      <div class={[classes.mult2rect, classes.mult2rect3].join(" ")}></div>
      <div class={[classes.mult2rect, classes.mult2rect4].join(" ")}></div>
      <div class={[classes.mult2rect, classes.mult2rect5].join(" ")}></div>
    </>
  );
}

export default Spinner;
