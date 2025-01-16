import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";

const BubbleSortVisualizer = () => {
  const [originalArray] = useState([50, 30, 70, 60, 90, 40, 20, 10]);
  const [array, setArray] = useState([...originalArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoRun, setAutoRun] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [colors, setColors] = useState(Array(originalArray.length).fill("#242424"));
  const [highlightedIndices, setHighlightedIndices] = useState(null); 
  const [highlightedLine, setHighlightedLine] = useState(null);
  const timeoutRef = useRef(null);
  const autoRunRef = useRef(autoRun);
  const [sortedIndices, setSortedIndices] = useState([]);


  function bubbleSort(array) {
    const steps = [];
    let n = array.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: "compare",
          indices: [j, j + 1],
          message: `So sánh ${array[j]} với ${array[j + 1]}`,
          array: [...array],
          sortedIndices: [...Array.from({ length: i }, (_, k) => n - 1 - k)],
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swapped = true;
          steps.push({
            type: "swap",
            indices: [j, j + 1],
            message: `Hoán đổi ${array[j]} với ${array[j + 1]}`,
            array: [...array],
            sortedIndices: [...Array.from({ length: i }, (_, k) => n - 1 - k)],
          });
        }
      }

      steps.push({
        type: "sorted",
        indices: [n - 1 - i],
        message: `Xác nhận ${array[n - 1 - i]} đã đúng vị trí`,
        array: [...array],
        sortedIndices: [...Array.from({ length: i + 1 }, (_, k) => n - 1 - k)],
      });

      if (!swapped) break;
    }

    return steps;
  }

  const animateCompare = async (indices) => {
    const newColors = [...colors];
    setHighlightedIndices(indices); // Đánh dấu các box đang so sánh

    // Đổi màu các box đang so sánh
    indices.forEach((i) => (newColors[i] = "#ff6f61"));
    setColors(newColors);

    const newPositions = [...positions];
    indices.forEach((i) => (newPositions[i].y = -1.5)); // Di chuyển các box xuống dưới
    setPositions(newPositions);

    // Cập nhật thanh ngang
    setHighlightedLine({
      x: (positions[indices[0]].x + positions[indices[1]].x) / 2,
      width: Math.abs(positions[indices[1]].x - positions[indices[0]].x),
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hiển thị kết quả so sánh
    const [i, j] = indices;
    if (array[i] > array[j]) {
      setMessage(`Kết quả: ${array[i]} > ${array[j]}, cần hoán đổi`);
    } else if (array[i] < array[j]) {
      setMessage(`Kết quả: ${array[i]} < ${array[j]}, không cần hoán đổi`);
    } else {
      setMessage(`Kết quả: ${array[i]} = ${array[j]}, không cần hoán đổi`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Khôi phục màu sắc lại sau khi so sánh
    indices.forEach((i) => (newColors[i] = "#242424"));
    setColors(newColors);
    indices.forEach((i) => (newPositions[i].y = 0)); // Đưa các box trở lại vị trí ban đầu
    setPositions(newPositions);
  };

  const animateSwap = async (indices) => {
    const [i, j] = indices;
    const newColors = [...colors];
    newColors[i] = "#ffd700"; // Màu sắc của box 1 khi hoán đổi
    newColors[j] = "#ffd700"; // Màu sắc của box 2 khi hoán đổi
    setColors(newColors);

    const newPositions = [...positions];
    const centerX = (positions[i].x + positions[j].x) / 2;
    const radius = Math.abs(positions[j].x - positions[i].x) / 2;

    for (let step = 0; step <= 30; step++) {
      const angle = (Math.PI * step) / 30;
      newPositions[i] = { x: centerX - radius * Math.cos(angle), y: radius * Math.sin(angle) };
      newPositions[j] = { x: centerX + radius * Math.cos(angle), y: -radius * Math.sin(angle) };
      setPositions([...newPositions]);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    [newPositions[i].x, newPositions[j].x] = [newPositions[j].x, newPositions[i].x];
    newPositions[i].y = 0;
    newPositions[j].y = 0;
    setPositions(newPositions);

    // Khôi phục màu sắc lại sau khi hoán đổi
    newColors[i] = "#242424";
    newColors[j] = "#242424";
    setColors(newColors);

    // await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const handleStep = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (currentStep >= steps.length || animating) return;

    setAnimating(true);
    const step = steps[currentStep];
    setMessage(step.message);

    if (step.type === "compare") {
      await animateCompare(step.indices);
    } else if (step.type === "swap") {
      await animateSwap(step.indices);
      setArray(step.array);
    } else if (step.type === "sorted") {
      setSortedIndices(step.sortedIndices); // Cập nhật trạng thái sortedIndices
      const newColors = [...colors];
      step.sortedIndices.forEach((index) => {
        newColors[index] = "#32cd32"; // Chuyển màu thành xanh lá cây
      });
      setColors(newColors);
    }

    setCurrentStep((prev) => prev + 1);
    setAnimating(false);

    if (currentStep + 1 >= steps.length) {
      setMessage("Sắp xếp xong!");
      setAutoRun(false);
    }
  };

  const handleAutoRun = async () => {
    if (!autoRunRef.current || animating) return;

    await handleStep();

    if (currentStep < steps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        handleAutoRun();
      }, 2000);
    } else {
      setMessage("Sắp xếp xong!");
      setAutoRun(false);
    }
  };

  useEffect(() => {
    autoRunRef.current = autoRun;
    if (autoRun) {
      handleAutoRun();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoRun, currentStep]);

  const resetSimulation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setArray([...originalArray]);
    setCurrentStep(0);
    setAutoRun(false);
    setSteps(bubbleSort([...originalArray]));
    setSortedIndices([]);
    const initialPositions = originalArray.map((_, index) => ({
      x: (index - originalArray.length / 2) * 2,
      y: 0,
    }));
    setPositions(initialPositions);
    setMessage("");
    setColors(Array(originalArray.length).fill("#242424"));
    setHighlightedIndices(null);
    setHighlightedLine(null);
  };

  useEffect(() => {
    resetSimulation();
  }, []);

  return (
    <>
      <div className="container control-container">
        <button onClick={resetSimulation}>Reset</button>
        <button onClick={handleStep} disabled={animating}>
          Next Step
        </button>
        <button onClick={() => setAutoRun((prev) => !prev)}>
          {autoRun ? "Pause" : "Auto Run"}
        </button>
      </div> <br />
      <div className="message-container" style={{
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px',
        border: '2px solid white',
        borderRadius: '5px',
        display: 'inline-block'
      }}>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100] }}>
        <ambientLight intensity={0.5} />
        {array.map((value, index) => (
          <group key={index} position={[positions[index]?.x || 0, positions[index]?.y || 0, 0]}>
            <Box args={[1, 1, 1]}>
              <meshStandardMaterial color={colors[index]} />
            </Box>
            <Text position={[0, 0, 0.6]} fontSize={0.5} color="white">
              {value}
            </Text>
          </group>
        ))}
      
        {highlightedLine && (
          <Box
            args={[highlightedLine.width, 0.1, 0.1]}
            position={[highlightedLine.x, 1, 0]}
          >
            <meshStandardMaterial color="yellow" />
          </Box>
        )}
      </Canvas>
    </>
  );
};

export default BubbleSortVisualizer;


// sửa đúng 1