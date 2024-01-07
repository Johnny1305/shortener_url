import { useState } from "react";
import Swal from "sweetalert2";

const InputShortener = ({ setInputValue }) => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    if (value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Input Error",
        text: "Input cannot be empty",
      });
    } else {
      setInputValue(value);
      setValue("");
    }
  };

  return (
    <div className="inputContainer">
      <h1>
        URL <span>Shortener</span>
      </h1>
      <div>
        <input
          type="text"
          placeholder="Paste a link to shorten it"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleClick}>shorten</button>
      </div>
    </div>
  );
};

export default InputShortener;
