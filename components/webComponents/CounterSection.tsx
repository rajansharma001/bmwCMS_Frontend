"use client";
import { useEffect, useRef, useState } from "react";

// Counter Component
const Counter = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [counterNumbers, setCounterNumbers] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    });
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/counters/get-counter`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            console.log(result.error);
          }
        } else {
          if (isMounted) {
            setCounterNumbers(result.getCounter);
          }
        }
      } catch (error) {
        console.log("API Error!", error);
      }
    };
    handleFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(counterNumbers);

  return (
    <div>
      <div ref={countRef} className="text-center">
        <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          {count}+
        </div>
        <div className="text-blue-200 font-medium uppercase tracking-wider text-sm">
          {label}
        </div>
      </div>
    </div>
  );
};

const CounterSection = () => {
  const [counterNumbers, setCounterNumbers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/counters/get-counter`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (res.ok && isMounted) {
          setCounterNumbers(result.getCounter || []);
        }
      } catch (error) {
        console.log("API Error!", error);
      }
    };
    handleFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
          {counterNumbers &&
            counterNumbers.map((count) => (
              <Counter
                key={count._id}
                end={count.countNumber}
                label={count.title}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
export default CounterSection;
