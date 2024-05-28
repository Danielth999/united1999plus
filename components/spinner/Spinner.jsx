import React from "react";
import styles from "./spin.module.css";
const Spinner = () => {
  return (
    <div>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Spinner;
