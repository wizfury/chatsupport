import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 50}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <span style={{ color: '#f48fb1'}}>{displayedText}</span>
  );
};

export default TypingEffect;
