import React, { useMemo } from 'react';

const SnowEffect: React.FC = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 10}s`,
      animationDelay: `-${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3,
      size: Math.random() * 3 + 1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-snow"
          style={{
            left: flake.left,
            top: -10,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
