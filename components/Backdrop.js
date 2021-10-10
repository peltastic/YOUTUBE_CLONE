function Backdrop(props) {
  return (
    <div
      onClick={props.clicked}
      className={
        props.Modal == true
          ? "background-trans fixed h-full w-full top-0 left-0 z-10" 
          : "none"
      }
    ></div>
  );
}

export default Backdrop;
