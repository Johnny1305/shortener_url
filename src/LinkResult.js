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

      // Update the API endpoint to the new Bitly API URL
      const res = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        {
          long_url: inputValue,
        },
        {
          headers: {
            Authorization: "Bearer 1dadc9442e0a9077d66f51144eb7487be8e6098c",
            "Content-Type": "application/json",
          },
        }
      );

      setShortenLink(res.data.id);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        // If API limit exceeded
        setApiLimitExceeded(true);
      } else {
        // Other errors
        setError(err);
      }
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
