import React from "react";
import QRCode from "qrcode.react";

import AccordionWindow from "./AccordionWindow";

const NamedQR = ({ data, title = "QR Code" }) => {
  return (
    <AccordionWindow className="accordion__code-snippet u-text-center" title={title}>
      <QRCode value={data} />
    </AccordionWindow>
  );
};

export default NamedQR;
