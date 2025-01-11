import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 40, 20, 60]);

  const boxRefs = useRef([]);

  useEffect(() => {});

  const mergeSort = () => {
  };


  const handleNextStep = async () => {};

  const resetSimulation = () => {};

  return (
    <>
    </>
  );
};

export default MergeSortVisualizer;


// import React, { useState, useEffect, useRef } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Text, Box } from "@react-three/drei";

// const BubbleSortVisualizer = () => {
//   const [originalArray] = useState([50, 30, 70, 10, 90, 40, 20, 60]);
//   const [array, setArray] = useState([...originalArray]);
//   const [steps, setSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [autoRun, setAutoRun] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [message, setMessage] = useState("");
//   const [comparing, setComparing] = useState([-1, -1]);
//   const [swapping, setSwapping] = useState([-1, -1]);
//   const [positions, setPositions] = useState([]);


//   const bubbleSort = (arr) => {
//     const steps = [];
//     const n = arr.length;
//     const tempArray = [...arr];

//     for (let i = 0; i < n - 1; i++) {
//       for (let j = 0; j < n - i - 1; j++) {
//         steps.push({
//           type: 'compare',
//           indices: [j, j + 1],
//           values: [tempArray[j], tempArray[j + 1]]
//         });

//         if (tempArray[j] > tempArray[j + 1]) {
//           steps.push({
//             type: 'swap',
//             indices: [j, j + 1],
//             values: [tempArray[j], tempArray[j + 1]]
//           });
//           [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
//         }
//       }
//     }
//     return steps;
//   };

//   const animateCompare = async (indices) => {
//     setComparing(indices);
//     setMessage(`So sánh ${array[indices[0]]} với ${array[indices[1]]}`);

//     const newPositions = [...positions];
//     for (let i of indices) {
//       newPositions[i] = {
//         ...newPositions[i],
//         y: -1.5
//       };
//     }
//     setPositions(newPositions);

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     if (!(array[indices[0]] > array[indices[1]])) {
//       for (let i of indices) {
//         newPositions[i] = {
//           ...newPositions[i],
//           y: 0
//         };
//       }
//       setPositions(newPositions);
//     }
//   };

//   const animateSwap = async (indices) => {
//     const [i, j] = indices;
//     setSwapping(indices);
//     setMessage(`Hoán đổi ${array[i]} với ${array[j]}`);

//     const radius = Math.abs(positions[j].x - positions[i].x) / 2;
//     const centerX = (positions[i].x + positions[j].x) / 2;

//     const originalPositions = {
//       i: { ...positions[i] },
//       j: { ...positions[j] }
//     };

//     const steps = 30;
//     for (let step = 0; step <= steps; step++) {
//       const progress = step / steps;
//       const angle = Math.PI * progress;

//       const newPositions = [...positions];
//       newPositions[i] = {
//         x: centerX - radius * Math.cos(angle),
//         y: radius * Math.sin(angle),
//         rotation: 0
//       };

//       newPositions[j] = {
//         x: centerX + radius * Math.cos(angle),
//         y: -radius * Math.sin(angle),
//         rotation: 0
//       };

//       setPositions(newPositions);
//       await new Promise(resolve => setTimeout(resolve, 20));
//     }

//     const finalPositions = [...positions];
//     finalPositions[i] = {
//       x: originalPositions.j.x,
//       y: 0,
//       rotation: 0
//     };
//     finalPositions[j] = {
//       x: originalPositions.i.x,
//       y: 0,
//       rotation: 0
//     };
//     setPositions(finalPositions);

//     await new Promise(resolve => setTimeout(resolve, 100));
//   };

//   const updateSteps = (currentArray) => {
//     const newSteps = bubbleSort([...currentArray]);
//     setSteps(newSteps);
//   };

//   useEffect(() => {
//     updateSteps(array);
//   }, []);

//   const handleNextStep = async () => {
//     if (currentStep >= steps.length) return;

//     setAnimating(true);
//     const step = steps[currentStep];

//     if (step.type === 'compare') {
//       setComparing(step.indices);
//       setMessage(`So sánh ${array[step.indices[0]]} với ${array[step.indices[1]]}`);

//       if (array[step.indices[0]] > array[step.indices[1]]) {
//         await animateSwap(step.indices);

//         const newArray = [...array];
//         [newArray[step.indices[0]], newArray[step.indices[1]]] =
//           [newArray[step.indices[1]], newArray[step.indices[0]]];
//         setArray(newArray);
//       }
//     } else if (step.type === 'swap') {
//       await animateSwap(step.indices);
//     }

//     setComparing([-1, -1]);
//     setSwapping([-1, -1]);
//     setCurrentStep(prev => prev + 1);
//     setAnimating(false);
//   };

//   const resetSimulation = () => {
//     const initialArray = [...originalArray];
//     setArray(initialArray);
//     setCurrentStep(0);
//     setComparing([-1, -1]);
//     setSwapping([-1, -1]);
//     setMessage("");
//     setAutoRun(false);

//     const initialPositions = initialArray.map((_, index) => ({
//       x: (index - initialArray.length / 2) * 2,
//       y: 0,
//       rotation: 0
//     }));
//     setPositions(initialPositions);

//     updateSteps(initialArray);
//   };

//   useEffect(() => {
//     let timeoutId;
//     if (autoRun && !animating && currentStep < steps.length) {
//       timeoutId = setTimeout(() => {
//         handleNextStep();
//       }, 500);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [autoRun, animating, currentStep, steps.length]);

//   useEffect(() => {
//     const initialPositions = array.map((_, index) => ({
//       x: (index - array.length / 2) * 2,
//       y: 0,
//       rotation: 0
//     }));
//     setPositions(initialPositions);
//   }, [array.length]);

//   return (
//     <>
//       <Canvas
//         orthographic
//         camera={{
//           zoom: 50,
//           position: [0, 0, 100],
//           left: -window.innerWidth / 2,
//           right: window.innerWidth / 2,
//           top: window.innerHeight / 2,
//           bottom: -window.innerHeight / 2,
//           near: 0.1,
//           far: 1000
//         }}
//       >
//         <ambientLight intensity={0.5} />
//         {array.map((value, index) => (
//           <group
//             key={index}
//             position={[positions[index]?.x || 0, positions[index]?.y || 0, 0]}
//           >
//             <Box
//               args={[1, 1, 1]}
//             >
//               <meshStandardMaterial
//                 color={
//                   comparing.includes(index)
//                     ? "yellow"
//                     : swapping.includes(index)
//                       ? "red"
//                       : "blue"
//                 }
//               />
//             </Box>
//             <Text
//               position={[0, 0, 0.6]}
//               fontSize={0.5}
//               color="white"
//               anchorX="center"
//               anchorY="middle"
//             >
//               {value}
//             </Text>
//           </group>
//         ))}
//         <Text
//           position={[0, -4, 0]}
//           fontSize={0.8}
//           color="black"
//         >
//           {message}
//         </Text>
//       </Canvas>
//       <div style={{ textAlign: "center", marginTop: "20px" }}>
//         <p>{message}</p>
//         <button onClick={resetSimulation}>Reset</button>
//         <button onClick={handleNextStep} disabled={autoRun || animating}>
//           Next Step
//         </button>
//         <button onClick={() => setAutoRun((prev) => !prev)}>
//           {autoRun ? "Pause" : "Auto Run"}
//         </button>
//       </div>
//     </>
//   );
// };

// export default BubbleSortVisualizer;
