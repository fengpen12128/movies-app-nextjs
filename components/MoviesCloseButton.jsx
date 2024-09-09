const MacCloseButton = ({ onClick }) => {
  return (
    <div className="mac-close-icon">
      <span className="mac-close-x">
        <span onClick={onClick} className="material-symbols-outlined text-xs">
          close
        </span>
      </span>
    </div>
  );
};

export { MacCloseButton };
