import classes from "./spinner.module.css";

function Spinner({ loading }) {
  return (

      <div className={`${classes.ldsripple} ${loading ? "z-50" : "z-50"} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}>
        <div></div>
        <div></div>
      </div>
  );
}

export default Spinner;
