import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language = "javascript", code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        console.error("Copy failed");
      });
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`absolute right-3 top-3 text-xs px-3 py-1 rounded transition ${
          copied
            ? "bg-green-600 text-white"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          borderRadius: "0.75rem",
          fontSize: "0.8rem"
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
