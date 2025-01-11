import React, { useState, useEffect } from "react";
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
  const [colors, setColors] = useState(Array(originalArray.length).fill("blue"));
  const [highlightedIndices, setHighlightedIndices] = useState(null); // Lưu vị trí các box đang so sánh
  const [highlightedLine, setHighlightedLine] = useState(null); // Lưu vị trí của thanh ngang vàng

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
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swapped = true;
          steps.push({
            type: "swap",
            indices: [j, j + 1],
            message: `Hoán đổi ${array[j]} với ${array[j + 1]}`,
            array: [...array],
          });
        }
      }

      if (!swapped) break;
    }

    return steps;
  }

  const animateCompare = async (indices) => {
    const newColors = [...colors];
    setHighlightedIndices(indices); // Đánh dấu các box đang so sánh

    // Đổi màu các box đang so sánh
    indices.forEach((i) => (newColors[i] = "red"));
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
      setMessage(`Kết quả: ${array[i]} > ${array[j]}`);
    } else if (array[i] < array[j]) {
      setMessage(`Kết quả: ${array[i]} < ${array[j]}`);
    } else {
      setMessage(`Kết quả: ${array[i]} = ${array[j]}`);
    }

    // Khôi phục màu sắc lại sau khi so sánh
    indices.forEach((i) => (newColors[i] = "blue"));
    setColors(newColors);
    indices.forEach((i) => (newPositions[i].y = 0)); // Đưa các box trở lại vị trí ban đầu
    setPositions(newPositions);
  };

  const animateSwap = async (indices) => {
    const [i, j] = indices;
    const newColors = [...colors];
    newColors[i] = "green"; // Màu sắc của box 1 khi hoán đổi
    newColors[j] = "green"; // Màu sắc của box 2 khi hoán đổi
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
    newColors[i] = "blue";
    newColors[j] = "blue";
    setColors(newColors);
  };

  const handleStep = async () => {
    if (currentStep >= steps.length || animating) return;

    setAnimating(true);
    const step = steps[currentStep];
    setMessage(step.message);

    if (step.type === "compare") {
      await animateCompare(step.indices);
    } else if (step.type === "swap") {
      await animateSwap(step.indices);
      setArray(step.array);
    }

    setCurrentStep((prev) => prev + 1);
    setAnimating(false);
  };

  const handleAutoRun = async () => {
    if (!autoRun || animating || currentStep >= steps.length) return;

    await handleStep();
    if (currentStep < steps.length) {
      setTimeout(handleAutoRun, 500);
    }
  };

  const resetSimulation = () => {
    setArray([...originalArray]);
    setCurrentStep(0);
    setAutoRun(false);
    setSteps(bubbleSort([...originalArray]));
    const initialPositions = originalArray.map((_, index) => ({
      x: (index - originalArray.length / 2) * 2,
      y: 0,
    }));
    setPositions(initialPositions);
    setMessage("");
    setColors(Array(originalArray.length).fill("blue"));
    setHighlightedIndices(null); // Đặt lại thanh ngang
    setHighlightedLine(null); // Đặt lại vị trí thanh ngang
  };

  useEffect(() => {
    resetSimulation();
  }, []);

  useEffect(() => {
    if (autoRun) {
      handleAutoRun();
    }
  }, [autoRun, animating, currentStep]);

  return (
    <>
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
        {/* Thanh ngang vàng giữ nguyên vị trí cho đến khi chuyển cặp mới */}
        {highlightedLine && (
          <Box
            args={[highlightedLine.width, 0.1, 0.1]}
            position={[highlightedLine.x, 0.5, 0]} // Đặt thanh ngang lên một chút
          >
            <meshStandardMaterial color="yellow" />
          </Box>
        )}
      </Canvas>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>{message}</p>
        <button onClick={resetSimulation}>Reset</button>
        <button onClick={handleStep} disabled={animating}>
          Next Step
        </button>
        <button onClick={() => setAutoRun((prev) => !prev)}>
          {autoRun ? "Pause" : "Auto Run"}
        </button>
      </div>
    </>
  );
};

export default BubbleSortVisualizer;





// sửa đúng 1
// sửa đúng 2
// sửa đúng 3
// sửa đúng 4