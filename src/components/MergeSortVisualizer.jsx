// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Text, Box } from "@react-three/drei";

// const MergeSortVisualizer = () => {
//   const [originalArray] = useState([50, 30, 70, 60, 90, 40, 20, 10]);
//   const [array, setArray] = useState([...originalArray]);
//   const [steps, setSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [autoRun, setAutoRun] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [message, setMessage] = useState("");
//   const [positions, setPositions] = useState([]);
//   const [colors, setColors] = useState(Array(originalArray.length).fill("#242424"));
//   const [highlightedIndices, setHighlightedIndices] = useState(null);
//   const timeoutRef = useRef(null);
//   const autoRunRef = useRef(autoRun);

//   function mergeSort(array) {
//     const steps = [];
//     function merge(left, right, start) {
//       let result = [];
//       let i = 0, j = 0;

//       while (i < left.length && j < right.length) {
//         steps.push({
//           type: "compare",
//           indices: [start + i, start + left.length + j],
//           message: `So sánh ${left[i]} với ${right[j]}`,
//           array: [...array],
//         });

//         if (left[i] <= right[j]) {
//           result.push(left[i++]);
//         } else {
//           result.push(right[j++]);
//         }
//       }

//       result = [...result, ...left.slice(i), ...right.slice(j)];

//       for (let k = 0; k < result.length; k++) {
//         array[start + k] = result[k];
//         steps.push({
//           type: "merge",
//           index: start + k,
//           value: result[k],
//           array: [...array],
//           message: `Gộp giá trị ${result[k]} vào vị trí ${start + k}`,
//         });
//       }

//       return result;
//     }

//     function divideAndMerge(arr, start) {
//       if (arr.length < 2) return arr;
//       const mid = Math.floor(arr.length / 2);
//       const left = divideAndMerge(arr.slice(0, mid), start);
//       const right = divideAndMerge(arr.slice(mid), start + mid);
//       return merge(left, right, start);
//     }

//     divideAndMerge(array, 0);
//     return steps;
//   }

//   const animateStep = async (step) => {
//     const newColors = [...colors];
//     if (step.type === "compare") {
//       setHighlightedIndices(step.indices);
//       step.indices.forEach((i) => (newColors[i] = "#ff6f61")); // Đỏ cho so sánh
//       setColors(newColors);
//     } else if (step.type === "merge") {
//       const { index, value } = step;
//       newColors[index] = "#32cd32"; // Xanh lá cây khi giá trị được gộp
//       setColors(newColors);
//       const newArray = [...array];
//       newArray[index] = value;
//       setArray(newArray);
//     }

//     setMessage(step.message);
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     if (step.type === "compare") {
//       step.indices.forEach((i) => (newColors[i] = "#242424")); // Trả lại màu mặc định
//       setColors(newColors);
//     }
//   };

//   const handleStep = async () => {
//     if (currentStep >= steps.length || animating) return;
//     setAnimating(true);
//     await animateStep(steps[currentStep]);
//     setCurrentStep((prev) => prev + 1);
//     setAnimating(false);

//     if (currentStep + 1 >= steps.length) {
//       setMessage("Sắp xếp xong!");
//       setAutoRun(false);
//     }
//   };

//   const handleAutoRun = async () => {
//     if (!autoRunRef.current || animating) return;
//     await handleStep();
//     if (currentStep < steps.length - 1) {
//       timeoutRef.current = setTimeout(() => {
//         handleAutoRun();
//       }, 2000);
//     } else {
//       setMessage("Sắp xếp xong!");
//       setAutoRun(false);
//     }
//   };

//   useEffect(() => {
//     autoRunRef.current = autoRun;
//     if (autoRun) {
//       handleAutoRun();
//     } else {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     }
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [autoRun, currentStep]);

//   const resetSimulation = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     setArray([...originalArray]);
//     setCurrentStep(0);
//     setAutoRun(false);
//     setSteps(mergeSort([...originalArray]));
//     const initialPositions = originalArray.map((_, index) => ({
//       x: (index - originalArray.length / 2) * 2,
//       y: 0,
//     }));
//     setPositions(initialPositions);
//     setMessage("");
//     setColors(Array(originalArray.length).fill("#242424"));
//     setHighlightedIndices(null);
//   };

//   useEffect(() => {
//     resetSimulation();
//   }, []);

//   return (
//     <>
//       <div className="container control-container">
//         <button onClick={resetSimulation}>Reset</button>
//         <button onClick={handleStep} disabled={animating}>
//           Next Step
//         </button>
//         <button onClick={() => setAutoRun((prev) => !prev)}>
//           {autoRun ? "Pause" : "Auto Run"}
//         </button>
//       </div>
//       <br />
//       <div
//         className="message-container"
//         style={{
//           backgroundColor: "blue",
//           color: "white",
//           padding: "10px",
//           border: "2px solid white",
//           borderRadius: "5px",
//           display: "inline-block",
//         }}
//       >
//         <p style={{ margin: 0 }}>{message}</p>
//       </div>
//       <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100] }}>
//         <ambientLight intensity={0.5} />
//         {array.map((value, index) => (
//           <group key={index} position={[positions[index]?.x || 0, positions[index]?.y || 0, 0]}>
//             <Box args={[1, 1, 1]}>
//               <meshStandardMaterial color={colors[index]} />
//             </Box>
//             <Text position={[0, 0, 0.6]} fontSize={0.5} color="white">
//               {value}
//             </Text>
//           </group>
//         ))}
//       </Canvas>
//     </>
//   );
// };

// export default MergeSortVisualizer;


import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";

const MergeSortVisualizer = () => {
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
  const timeoutRef = useRef(null);
  const autoRunRef = useRef(autoRun);

  // MergeSort logic with steps recording
  function mergeSort(array) {
    const steps = [];
    function merge(left, right, start) {
      let result = [];
      let i = 0,
        j = 0;

      while (i < left.length && j < right.length) {
        steps.push({
          type: "compare",
          indices: [start + i, start + left.length + j],
          message: `So sánh ${left[i]} với ${right[j]}`,
          array: [...array],
        });

        if (left[i] <= right[j]) {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
      }

      result = [...result, ...left.slice(i), ...right.slice(j)];

      for (let k = 0; k < result.length; k++) {
        array[start + k] = result[k];
        steps.push({
          type: "merge",
          index: start + k,
          value: result[k],
          array: [...array],
          message: `Gộp giá trị ${result[k]} vào vị trí ${start + k}`,
        });
      }

      return result;
    }

    function divideAndMerge(arr, start) {
      if (arr.length < 2) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = divideAndMerge(arr.slice(0, mid), start);
      const right = divideAndMerge(arr.slice(mid), start + mid);
      return merge(left, right, start);
    }

    divideAndMerge(array, 0);
    return steps;
  }

  // Animation handlers
  const animateCompare = async (indices) => {
    const newColors = [...colors];
    setHighlightedIndices(indices);

    indices.forEach((i) => (newColors[i] = "#ff6f61")); // Red for compare
    setColors(newColors);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    indices.forEach((i) => (newColors[i] = "#242424")); // Reset colors
    setColors(newColors);
  };

  const animateMerge = async (index, value) => {
    const newColors = [...colors];
    newColors[index] = "#32cd32"; // Green for merged value
    setColors(newColors);

    const newPositions = [...positions];
    newPositions[index] = { ...newPositions[index], y: -1 }; // Drop the merged box
    setPositions(newPositions);

    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    newPositions[index] = { ...newPositions[index], y: 0 }; // Return box to original position
    setPositions(newPositions);
  };

  const handleStep = async () => {
    if (currentStep >= steps.length || animating) return;
    setAnimating(true);
    const step = steps[currentStep];
    setMessage(step.message);

    if (step.type === "compare") {
      await animateCompare(step.indices);
    } else if (step.type === "merge") {
      await animateMerge(step.index, step.value);
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
    setSteps(mergeSort([...originalArray]));
    const initialPositions = originalArray.map((_, index) => ({
      x: (index - originalArray.length / 2) * 2,
      y: 0,
    }));
    setPositions(initialPositions);
    setMessage("");
    setColors(Array(originalArray.length).fill("#242424"));
    setHighlightedIndices(null);
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
      </Canvas>
    </>
  );
};

export default MergeSortVisualizer;


// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Text, Box } from "@react-three/drei";

// const MergeSortVisualizer = () => {
//   const [originalArray] = useState([50, 30, 70, 60, 90, 40, 20, 10]);
//   const [array, setArray] = useState([...originalArray]);
//   const [steps, setSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [autoRun, setAutoRun] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [message, setMessage] = useState("");
//   const [positions, setPositions] = useState([]);
//   const timeoutRef = useRef(null);
//   const autoRunRef = useRef(autoRun);

//   // MergeSort logic with divide and merge visualization
//   function mergeSort(array) {
//     const steps = [];
//     const divisions = [];

//     function divideAndMerge(arr, start, level = 0) {
//       if (arr.length < 2) {
//         divisions.push({ array: [...arr], start, level });
//         return arr;
//       }

//       const mid = Math.floor(arr.length / 2);
//       const left = divideAndMerge(arr.slice(0, mid), start, level + 1);
//       const right = divideAndMerge(arr.slice(mid), start + mid, level + 1);

//       const merged = merge(left, right, start, level);
//       divisions.push({ array: [...merged], start, level });
//       return merged;
//     }

//     function merge(left, right, start, level) {
//       let result = [];
//       let i = 0,
//         j = 0;

//       while (i < left.length && j < right.length) {
//         steps.push({
//           type: "compare",
//           indices: [start + i, start + left.length + j],
//           message: `So sánh ${left[i]} với ${right[j]}`,
//           array: [...array],
//         });

//         if (left[i] <= right[j]) {
//           result.push(left[i++]);
//         } else {
//           result.push(right[j++]);
//         }
//       }

//       result = [...result, ...left.slice(i), ...right.slice(j)];

//       for (let k = 0; k < result.length; k++) {
//         steps.push({
//           type: "merge",
//           index: start + k,
//           value: result[k],
//           array: [...array],
//           message: `Gộp giá trị ${result[k]} vào vị trí ${start + k}`,
//         });
//       }
//       return result;
//     }

//     divideAndMerge(array, 0);
//     steps.push(...divisions.map((div) => ({ type: "divide", ...div })));
//     return steps;
//   }

//   // Animation handlers
//   const animateCompare = async (indices) => {
//     setMessage(`So sánh giá trị tại các vị trí ${indices.join(" và ")}`);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   };

//   const animateMerge = async (index, value) => {
//     setMessage(`Gộp giá trị ${value} vào vị trí ${index}`);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   };

//   const handleStep = async () => {
//     if (currentStep >= steps.length || animating) return;
//     setAnimating(true);
//     const step = steps[currentStep];

//     if (step.type === "compare") {
//       await animateCompare(step.indices);
//     } else if (step.type === "merge") {
//       await animateMerge(step.index, step.value);
//     }

//     setCurrentStep((prev) => prev + 1);
//     setAnimating(false);

//     if (currentStep + 1 >= steps.length) {
//       setMessage("Sắp xếp hoàn thành!");
//       setAutoRun(false);
//     }
//   };

//   const handleAutoRun = async () => {
//     if (!autoRunRef.current || animating) return;
//     await handleStep();
//     if (currentStep < steps.length - 1) {
//       timeoutRef.current = setTimeout(() => {
//         handleAutoRun();
//       }, 2000);
//     } else {
//       setMessage("Sắp xếp hoàn thành!");
//       setAutoRun(false);
//     }
//   };

//   useEffect(() => {
//     autoRunRef.current = autoRun;
//     if (autoRun) {
//       handleAutoRun();
//     } else {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     }
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [autoRun, currentStep]);

//   const resetSimulation = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     setArray([...originalArray]);
//     setCurrentStep(0);
//     setAutoRun(false);
//     setSteps(mergeSort([...originalArray]));
//     setMessage("");
//   };

//   useEffect(() => {
//     resetSimulation();
//   }, []);

//   return (
//     <>
//       <div className="container control-container">
//         <button onClick={resetSimulation}>Reset</button>
//         <button onClick={handleStep} disabled={animating}>
//           Next Step
//         </button>
//         <button onClick={() => setAutoRun((prev) => !prev)}>
//           {autoRun ? "Pause" : "Auto Run"}
//         </button>
//       </div>
//       <br />
//       <div
//         className="message-container"
//         style={{
//           backgroundColor: "blue",
//           color: "white",
//           padding: "10px",
//           border: "2px solid white",
//           borderRadius: "5px",
//           display: "inline-block",
//         }}
//       >
//         <p style={{ margin: 0 }}>{message}</p>
//       </div>
//       <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100] }}>
//         <ambientLight intensity={0.5} />
//         {steps
//           .filter((step) => step.type === "divide")
//           .map((step, index) => (
//             <group
//               key={index}
//               position={[
//                 step.start * 2 - array.length, // X-axis spacing
//                 -step.level * 2, // Y-axis spacing
//                 0,
//               ]}
//             >
//               {step.array.map((value, i) => (
//                 <group key={i} position={[i * 2, 0, 0]}>
//                   <Box args={[1, 1, 1]}>
//                     <meshStandardMaterial color="#f3f3f3" />
//                   </Box>
//                   <Text position={[0, 0, 0.6]} fontSize={0.5} color="black">
//                     {value}
//                   </Text>
//                 </group>
//               ))}
//             </group>
//           ))}
//       </Canvas>
//     </>
//   );
// };

// export default MergeSortVisualizer;
