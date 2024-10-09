import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

function formatTime(number) {
  return String(number).padStart(2, '0');
}

function MyTimer() {
  const { seconds, minutes, hours, start, restart } = useTimer({
    autoStart: false,
  });

  // 初始化时从0开始
  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 0); // 从0秒开始
    restart(time, true);
  }, [restart]);

  return (
    <div>
      <div style={{ fontSize: '12px' }}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <button className="text-xs border border-gray-300 rounded-md px-2 py-1"  onClick={start}>Start</button>
    </div>
  );
}

export default MyTimer;
