"use client";
import ReactDOM from "react-dom";

const PortalComponent = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.body // 将内容渲染到 body 元素中
  );
};

export default PortalComponent;
