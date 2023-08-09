import { useState } from "react";
import styles from "./SideBar.module.css";
import { Gradient, X, Calendar } from "@phosphor-icons/react";

export function SideBar({ onCalendarClick, onToggleClick }) {
  const [isGradientVisible, setIsGradientVisible] = useState(true);

  const handleIconClick = () => {
    setIsGradientVisible(!isGradientVisible);
    onToggleClick();
  };

  return (
    <div className={styles.SideBar}>
      <aside>
        <div className={styles.toggle}>
          <button onClick={handleIconClick} className={styles.toggleButton}>
            {isGradientVisible ? (
              <Gradient size={32} />
            ) : (
              <X size={32} className={styles.Xicon} />
            )}
          </button>
          <button onClick={onCalendarClick} className={styles.Calendar}>
            <Calendar size={32} />
          </button>
        </div>
      </aside>
    </div>
  );
}
