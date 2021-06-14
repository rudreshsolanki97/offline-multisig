import React from "react";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AccordionWindow from "./AccordionWindow";

const tab = "    ";

const DefaultTitle = "Code Snippet";

const ParseCodeSnippetToHTML = (txt) => {
  return txt.split("\n").map((e) => {
    return (
      <>
        {e.replace("\r", tab)}
        <br />
      </>
    );
  });
};

function CodeSnippet(props) {
  const parsedCode = ParseCodeSnippetToHTML(props.code);

  const CodeJSX = (
    <pre className="code-snippet">
      <div className="copy-btn">
        <CopyToClipboard
          onCopy={() => {
            toast.info("Copied", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          }}
          text={props.code}
        >
          <i class="fas fa-copy view-pointer" />
        </CopyToClipboard>
      </div>

      {parsedCode}
    </pre>
  );

  if (props.collapsable) {
    return (
      <AccordionWindow className="accordion__code-snippet" title={props.title || DefaultTitle}>
        {CodeJSX}
      </AccordionWindow>
    );
  } else {
    return CodeJSX;
  }
}

export default CodeSnippet;
