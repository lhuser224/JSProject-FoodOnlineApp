import { useState, useEffect } from 'react';
import styles from './Home.module.css';

export default function SearchBar({ onSearch, initialValue, className }) {
  const [term, setTerm] = useState(initialValue || '');

  // Quan trọng: Đồng bộ lại Input khi initialValue thay đổi (ví dụ khi nhấn Clear Filter)
  useEffect(() => {
    setTerm(initialValue || '');
  }, [initialValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch(term);
  };

  return (
    <div className={`${styles.searchBoxLarge} ${className}`}> 
      <input
        type="text"
        placeholder="Find foods ..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.btnSearch} onClick={() => onSearch(term)}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  );
}