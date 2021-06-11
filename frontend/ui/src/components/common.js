import QRCode from "qrcode.react";

export const LOADER_BOX = (
  <div className="box">
    <div className="loader-box"></div>
  </div>
);

export const SwitchStyle2 = {
  onColor: "#86d3ff",
  onHandleColor: "#2693e6",
  handleDiameter: 10,
  uncheckedIcon: false,
  checkedIcon: false,
  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.6)",
  activeBoxShadow: "0px 0px 1px 10px rgba(0, 0, 0, 0.2)",
  height: 8,
  width: 20,
};

export const RenderQR = (value) => {
  return <QRCode value={value} />;
};
