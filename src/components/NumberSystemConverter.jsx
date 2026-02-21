import React, { useState, useEffect } from "react";

const BinaryManipulator = ({ binary, onBinaryChange }) => {
  const [bits, setBits] = useState(Array(32).fill(0));

  useEffect(() => {
    const newBits = Array(32).fill(0);
    if (binary) {
      // Ensure we take the last 32 bits if the string is longer
      const binArray = binary.split("").map(Number);
      const offset = Math.max(0, 32 - binArray.length);
      for (let i = 0; i < binArray.length && i < 32; i++) {
        newBits[31 - (binArray.length - 1 - i)] = binArray[i];
      }
    }
    setBits(newBits);
  }, [binary]);

  const toggleBit = (index) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    onBinaryChange(newBits.join(""));
  };

  const setAll = () => onBinaryChange("1".repeat(32));
  const clearAll = () => onBinaryChange("0".repeat(32));
  const shiftLeft = () => onBinaryChange(bits.slice(1).join("") + "0");
  const shiftRight = () => onBinaryChange("0" + bits.slice(0, 31).join(""));

  const labelPositions = [31, 24, 23, 16, 15, 8, 7, 0];

  return (
    <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
        32-Bit Manipulator
      </h2>

      <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-32 gap-2 mb-8">
        {bits.map((bit, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-slate-500 h-4">
              {labelPositions.includes(31 - index) ? 31 - index : ""}
            </span>
            <button
              onClick={() => toggleBit(index)}
              className={`w-full aspect-square sm:aspect-auto sm:h-10 rounded-md font-mono font-bold transition-all duration-200 border-b-4 ${
                bit === 1
                  ? "bg-emerald-500 border-emerald-700 text-emerald-950 scale-105 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-700 border-slate-900 text-slate-400 hover:bg-slate-600"
              }`}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={shiftLeft}
          className="flex-1 bg-slate-700 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Shift L
        </button>
        <button
          onClick={shiftRight}
          className="flex-1 bg-slate-700 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Shift R
        </button>
        <button
          onClick={setAll}
          className="flex-1 bg-slate-700 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Set All
        </button>
        <button
          onClick={clearAll}
          className="flex-1 bg-slate-700 hover:bg-rose-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const NumberSystemConverter = () => {
  const [values, setValues] = useState({
    decimal: "",
    octal: "",
    hexadecimal: "",
    binary: "",
  });

  const updateAllSystems = (decValue) => {
    // Check if value is null, empty string, or NaN
    if (decValue === "" || decValue === null || isNaN(decValue)) {
      setValues({ decimal: "", octal: "", hexadecimal: "", binary: "" });
      return;
    }

    // Force to 32-bit unsigned integer using the >>> bitwise operator
    const unsignedDec = Number(decValue) >>> 0;

    setValues({
      decimal: decValue.toString(),
      octal: unsignedDec.toString(8),
      hexadecimal: unsignedDec.toString(16).toUpperCase(),
      binary: unsignedDec.toString(2).padStart(32, "0"),
    });
  };

  const handleChange = (e, base) => {
    const val = e.target.value;
    if (!val) return updateAllSystems("");

    let dec;
    // Map input string to decimal based on the base
    if (base === "decimal") dec = parseInt(val, 10);
    else if (base === "octal") dec = parseInt(val, 8);
    else if (base === "hexadecimal") dec = parseInt(val, 16);
    else if (base === "binary") dec = parseInt(val, 2);

    if (!isNaN(dec)) {
      updateAllSystems(dec);
    }
  };

  const inputFields = [
    { label: "Decimal", key: "decimal", base: "10", color: "border-blue-500" },
    {
      label: "Hexadecimal",
      key: "hexadecimal",
      base: "16",
      color: "border-purple-500",
    },
    { label: "Octal", key: "octal", base: "8", color: "border-amber-500" },
    { label: "Binary", key: "binary", base: "2", color: "border-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Base<span className="text-indigo-500">Master</span>
          </h1>
          <p className="text-slate-400">
            Precision number system conversion & bit manipulation
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {inputFields.map((field) => (
            <div key={field.key} className="relative group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                {field.label}
              </label>
              <input
                type="text"
                value={values[field.key]}
                onChange={(e) => handleChange(e, field.key)}
                className={`w-full bg-slate-900 border-2 border-slate-800 focus:outline-none focus:${field.color} rounded-xl px-4 py-3 font-mono text-lg transition-all`}
                placeholder={`Enter ${field.label}...`}
              />
            </div>
          ))}
        </div>

        <BinaryManipulator
          binary={values.binary}
          onBinaryChange={(bin) =>
            handleChange({ target: { value: bin } }, "binary")
          }
        />

        <div className="mt-12 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
                <th className="p-4">Decimal</th>
                <th className="p-4">Binary</th>
                <th className="p-4">Octal</th>
                <th className="p-4">Hex</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-sm">
              {[1, 2, 4, 8, 10, 16, 32, 64, 127, 255].map((num) => (
                <tr
                  key={num}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 text-white">{num}</td>
                  <td className="p-4 text-emerald-500">
                    {num.toString(2).padStart(8, "0")}
                  </td>
                  <td className="p-4 text-amber-500">{num.toString(8)}</td>
                  <td className="p-4 text-purple-500">
                    {num.toString(16).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NumberSystemConverter;
