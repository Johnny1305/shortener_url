import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [apiLimitExceeded, setApiLimitExceeded] = useState(false); // New state

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Actualiza la URL para que coincida con la nueva API de shrinkme.io
      const apiKey = "57d3bff266ddfa796820d3ccc159a50507b33616"; // Asegúrate de usar tu API key
      const res = await axios.get(`https://shrinkme.io/api`, {
        params: {
          api: apiKey,
          url: inputValue,
          alias: "" // Si deseas un alias personalizado, cámbialo aquí
        }
      });

      // Comprueba si la respuesta indica un éxito
      if (res.data.status === "success") {
        setShortenLink(res.data.shortenedUrl);
      } else if (res.data.status === "error" && res.data.message.includes("API limit exceeded")) {
        setApiLimitExceeded(true);
      } else {
        setError(new Error(res.data.message || "Unknown error"));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [inputValue]);

  useEffect(() => {
    if (inputValue.length) {
      fetchData();
    }
  }, [inputValue, fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  if (loading) {
    return <p className="noData">Loading...</p>;
  }
  if (error) {
    return <p className="noData">Something went wrong :(</p>;
  }
  if (apiLimitExceeded) {
    return <p className="noData">API limit exceeded. Please try again later.</p>;
  }

  return (
    <>
      {shortenLink && (
        <div className="result">
          <p>{shortenLink}</p>
          <CopyToClipboard text={shortenLink} onCopy={() => setCopied(true)}>
            <button className={copied ? "copied" : ""}>Copy to Clipboard</button>
          </CopyToClipboard>
        </div>
      )}
    </>
  );
};

export default LinkResult;
