import styles from "./Header.module.css";

export function Header() {
  return (
    <div className={styles.header}>
      <h1>Gerenciador de postagens</h1>
      <a href="/login">LOGIN</a>
    </div>
  );
}
