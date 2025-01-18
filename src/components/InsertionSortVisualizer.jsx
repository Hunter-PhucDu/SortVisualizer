import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import "./InsertionSortVisualizer.scss";


const InsertionSortVisualizer = () => {
  const [numElements, setNumElements] = useState(10);  // Số phần tử trong mảng
  const [minValue, setMinValue] = useState(10);        // Giá trị nhỏ nhất trong mảng
  const [maxValue, setMaxValue] = useState(100);       // Giá trị lớn nhất trong mảng
  const [originalArray, setOriginalArray] = useState([50, 30, 70, 60, 90, 80, 100, 40, 20, 10]);
  const [arrayInput, setArrayInput] = useState(originalArray.join(", "));
  const [array, setArray] = useState([...originalArray]);
  const [displayArray, setDisplayArray] = useState([...originalArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoRun, setAutoRun] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [originalPositions, setOriginalPositions] = useState([]);
  const [colors, setColors] = useState(Array(originalArray.length).fill("#242424"));
  const [highlightedIndices, setHighlightedIndices] = useState(null);
  const timeoutRef = useRef(null);
  const autoRunRef = useRef(autoRun);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [initialPositions, setInitialPositions] = useState([]);

  const [positions, setPositions] = useState(
    originalArray.map((value, index) => ({
      id: `box-${index}`,
      value,
      x: (index - originalArray.length / 2) * 2,
      y: 0,
      isCopy: false,
    }))
  );

  useEffect(() => {
    resetSimulation();
    if (originalArray.length > 0) {
      const initialPositions = originalArray.map((value, index) => ({
        id: `box-${index}`,
        value,
        x: (index - originalArray.length / 2) * 2,
        y: 0,
        isCopy: false,
      }));
      setPositions(initialPositions);
      setInitialPositions(initialPositions.map((box) => ({ ...box }))); // Tạo một bản sao các vị trí ban đầu
    }
  }, [originalArray]);

  const handleArrayInputChange = (e) => {
    setArrayInput(e.target.value);
  };

  const updateArrayFromInput = () => {
    try {
      const newArray = arrayInput
        .split(",") // Tách chuỗi thành mảng dựa trên dấu phẩy
        .map((value) => parseInt(value.trim(), 10)) // Loại bỏ khoảng trắng và chuyển sang số nguyên
        .filter((value) => !isNaN(value)); // Loại bỏ giá trị không hợp lệ

      if (newArray.length === 0) {
        throw new Error("Mảng không hợp lệ hoặc rỗng.");
      }

      setOriginalArray(newArray);
      setMessage("Đã cập nhật mảng thành công.");
    } catch (error) {
      setMessage(`Lỗi: ${error.message}`);
    }
  };

  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < numElements; i++) {
      newArray.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    }
    setOriginalArray(newArray);
    setArrayInput(newArray.join(", "));
  };

  function insertionSort(array) {
    const steps = [];
    const n = array.length;

    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;

      steps.push({
        type: "select",
        indices: [i],
        message: `Lấy khóa ${key} từ vị trí ${i}`,
        array: [...array],
      });

      while (j >= 0 && array[j] > key) {
        steps.push({
          type: "compare",
          indices: [j, j + 1],
          message: `So sánh ${array[j]} với khóa ${key}`,
          array: [...array],
        });

        array[j + 1] = array[j];
        steps.push({
          type: "shift",
          indices: [j, j + 1],
          message: `Dịch chuyển ${array[j]} sang vị trí ${j + 1}`,
          array: [...array],
        });
        j--;
      }

      array[j + 1] = key;
      steps.push({
        type: "insert",
        indices: [j + 1, i],
        message: `Chèn khóa ${key} vào vị trí ${j + 1}`,
        array: [...array],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      });
    }

    return steps;
  }

  const animateStep = async (step) => {
    const newColors = [...colors];

    if (step.type === "select") {
      setHighlightedIndices(step.indices);
      step.indices.forEach((i) => (newColors[i] = "#ff6f61"));
      setColors(newColors);

      // Tạo box bản sao nếu chưa tồn tại
      const newPositions = positions.map((box) => ({ ...box }));

      step.indices.forEach((i) => {
        const originalBox = newPositions[i];
        if (!newPositions.find(box => box.id === `copy-${originalBox.id}`)) {
          const copyBox = {
            id: `copy-${originalBox.id}`,
            value: originalBox.value,
            x: originalBox.x,
            y: -1.5,
            isCopy: true,
            originalX: originalBox.x, // Lưu trữ vị trí ban đầu
          };
          newPositions.push(copyBox);
        }

        // Ẩn box gốc
        newPositions[i] = { ...originalBox, hidden: true };
      });

      setPositions(newPositions);

      console.log(`abc: `, newPositions);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (step.type === "compare") {
      setHighlightedIndices(step.indices);
      step.indices.forEach((i) => (newColors[i] = "#ff6f61"));
      setColors(newColors);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (step.type === "shift") {
      const [from, to] = step.indices;
      const newColors = [...colors];
      newColors[from] = "#ffd700"; // Màu vàng cho box đang dịch chuyển
      setColors(newColors);

      const newPositions = positions.map((box) => ({ ...box }));

      // Tìm hộp "from"
      const fromBox = newPositions.find((box) => box.id === `box-${from}`);

      if (!fromBox) return;

      // Di chuyển hộp "from" đến vị trí của "to"
      const toX = initialPositions[to].x; // Vị trí ban đầu của vị trí "to"
      const fromX = fromBox.x;
      const distance = toX - fromX;

      // Animation dịch chuyển mượt
      for (let i = 0; i <= 30; i++) {
        const progress = i / 30;
        fromBox.x = fromX + distance * progress;
        fromBox.y = Math.sin(progress * Math.PI) * 0.5; // Dịch chuyển theo hình vòng cung
        setPositions([...newPositions]);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Cập nhật vị trí cuối cùng và trạng thái
      fromBox.x = toX;
      fromBox.y = 0;

      // Đánh dấu hộp "to" đã bị ghi đè
      newPositions[to] = { ...fromBox, id: `box-${to}` };
      newPositions[from] = { ...newPositions[from], hidden: true }; // Ẩn hộp gốc "from"

      setPositions(newPositions);
      newColors[to] = "#32cd32";
      setColors(newColors);
    }

    if (step.type === "insert") {
      const [to, from] = step.indices;
      const newPositions = positions.map((box) => ({ ...box }));

      const fromBox = newPositions.find((box) => box.id === `copy-box-${from}`);
      const toBox = initialPositions[to];

      if (!fromBox || !toBox) return;

      const toX = initialPositions[to].x; // Vị trí đích trên trục x
      const fromX = fromBox.x; // Vị trí bắt đầu trên trục x
      const distance = Math.abs(toX - fromX); // Khoảng cách giữa hai box
      const steps = 30; // Số bước để hoạt ảnh mượt

      if (distance <= 3 * 2) {
        // Khoảng cách nhỏ hoặc bằng 4 box: Di chuyển theo cung tròn
        const radius = distance / 2; // Bán kính nửa đường tròn
        const centerX = (toX + fromX) / 2; // Tâm đường tròn trên trục x
        const centerY = -radius; // Tâm đường tròn trên trục y (âm)

        for (let i = 0; i <= steps; i++) {
          const angle = (Math.PI * i) / -steps; // Góc chạy từ 0 đến π
          fromBox.x = centerX + radius * Math.cos(angle); // Tọa độ x theo cung tròn
          fromBox.y = centerY + radius * Math.sin(angle); // Tọa độ y theo cung tròn
          setPositions([...newPositions]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      } else if (distance <= 5 * 2) {
        // Khoảng cách từ 5 đến 7 box: Di chuyển theo elip
        const a = distance / 2; // Bán trục lớn (theo trục x)
        const b = Math.min(a / 2, 2); // Bán trục nhỏ (theo trục y), giới hạn chiều cao elip
        const centerX = (toX + fromX) / 2; // Tâm elip trên trục x
        const centerY = -b; // Tâm elip trên trục y (âm)

        for (let i = 0; i <= steps; i++) {
          const angle = (Math.PI * i) / -steps; // Góc chạy từ 0 đến π
          fromBox.x = centerX + a * Math.cos(angle); // Tọa độ x theo elip
          fromBox.y = centerY + b * Math.sin(angle); // Tọa độ y theo elip
          setPositions([...newPositions]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      } else {
        // Khoảng cách lớn hơn 7 box: Di chuyển ngang rồi lên
        // Di chuyển sang ngang (giữ y cố định)
        for (let i = 0; i <= (steps + 200) / 2; i++) {
          const progress = i / ((steps + 200) / 2);
          fromBox.x = fromX + (toX - fromX) * progress; // Di chuyển x từ fromX đến toX
          fromBox.y = -1.5; // Giữ y cố định
          setPositions([...newPositions]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Di chuyển lên đến vị trí cuối cùng (giữ x cố định)
        for (let i = 0; i <= steps / 2; i++) {
          const progress = i / (steps / 2);
          fromBox.x = toX; // X cố định tại vị trí cuối cùng
          fromBox.y = 0 + (initialPositions[to].y - 0) * progress; // Tăng y từ 0 đến vị trí đích
          setPositions([...newPositions]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      }

      fromBox.x = toBox.x;
      fromBox.y = 0;

      // Cập nhật vị trí và trạng thái
      newPositions[to] = { ...fromBox, id: `box-${to}`, isCopy: false, hidden: false };
      setPositions(newPositions.filter((box) => !box.isCopy || box.id === `box-${to}`));
      newColors[to] = "#32cd32";
      setColors(newColors);
    }


    setMessage(step.message);
  };

  const handleStep = async () => {
    if (currentStep >= steps.length || animating) return;

    setAnimating(true);
    const step = steps[currentStep];
    await animateStep(step);
    setArray(step.array);
    setDisplayArray(step.array);
    setCurrentStep((prev) => prev + 1);
    setAnimating(false);

    if (currentStep + 1 >= steps.length) {
      setMessage("Sắp xếp xong!");
      setAutoRun(false);
      setColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[0] = "#32cd32";
        return newColors;
      });
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
    setDisplayArray([...originalArray]);
    setSteps(insertionSort([...originalArray]));
    setPositions(
      originalArray.map((value, index) => ({
        id: `box-${index}`,
        value,
        x: (index - originalArray.length / 2) * 2,
        y: 0,
        isCopy: false,
      }))
    );
    setColors(Array(originalArray.length).fill("#242424"));
    setHighlightedIndices(null);
    setCurrentStep(0);
    setAutoRun(false);
    setMessage("");
    setSortedIndices([]);
  };

  const boxSize = numElements > 11 ? 1 / (numElements / 13) : 1;
  const boxSpacing = numElements > 4 ? 1 / (numElements / 10) : 2;

  return (
    <>
      <div className="container control-container">
        <div className="array-container">
          <div className="array-input-container">
            <label>
              Nhập mảng:
              <input
                type="text"
                value={arrayInput}
                onChange={handleArrayInputChange}
                placeholder="Ví dụ: 10, 20, 30, 40"
              />
            </label>
            <button onClick={updateArrayFromInput}>Cập nhật mảng</button>
          </div>
          <div className="array-element">
            <div className="array-input-element">
              <div className="array-menu">
                <label>
                  Số phần tử:
                  <input
                    type="number"
                    value={numElements}
                    onChange={(e) => setNumElements(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                </label>
              </div>
              <div className="array-menu">
                <label>
                  Giá trị nhỏ nhất:
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                  />
                </label>
              </div>
              <div className="array-menu">
                <label>
                  Giá trị lớn nhất:
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>
            <div className="array-button">
              <button onClick={generateArray}>Tạo mảng mới</button>
            </div>
          </div>
        </div>
        <div className="menu-container">
          <button onClick={resetSimulation}>Reset</button>
          <button onClick={handleStep} disabled={animating}>
            Next Step
          </button>
          <button onClick={() => setAutoRun((prev) => !prev)}>
            {autoRun ? "Pause" : "Auto Run"}
          </button>
        </div>
        <br />
        <div
          className="message-container"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            border: "2px solid white",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          <p style={{ margin: 0 }}>{message}</p>
        </div>
      </div>
      {console.log(`positions: `, positions)}
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100] }} className="canvas-container">
        <ambientLight intensity={0.5} />
        <OrbitControls
          enableRotate={false}  // Tắt xoay
          enableZoom={true}     // Cho phép zoom
          enablePan={true}      // Cho phép kéo
          panSpeed={1}          // Tốc độ kéo
          zoomSpeed={0.5}       // Tốc độ zoom
          minZoom={10}          // Giới hạn zoom nhỏ nhất
          maxZoom={1000}         // Giới hạn zoom lớn nhất
        />
        {positions.map((box, index) => (
          !box.hidden && (
            <group key={box.id} position={[box.x * boxSpacing, box.y, 0]}>
              <Box args={[boxSize, boxSize, boxSize]}>
                <meshStandardMaterial color={colors[index]} />
              </Box>
              <Text position={[0, 0, boxSize / 2 + 0.1]} fontSize={boxSize / 2} color="white">
                {box.value}
              </Text>
              <Text
                position={[0, -boxSize / 2 - 0.2, boxSize / 2]}  // Đẩy chữ lên thêm một chút
                fontSize={boxSize / 4}
                color="gold"
                fontWeight="bold"
              >
                {box.isCopy ? box.id.split('copy-box-')[1] : index}
              </Text>
            </group>
          )
        ))}
      </Canvas>
    </>
  );
};

export default InsertionSortVisualizer;