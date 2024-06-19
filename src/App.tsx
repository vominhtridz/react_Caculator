
import { useRef ,useEffect, useState} from "react";
import { MouseEvent } from "react";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from "@fortawesome/free-regular-svg-icons";
const keyboard = [
  "2nd",
  "Rad",
  "Sin",
  "Cos",
  "Tan",
  "x^y",
  "lg",
  "ln",
  "(",
  ")",
  "/x",
  "AC", 
  "<-",
  "%", 
  "/",
  "x!", 
  7, 
  8, 
  9, 
  "x",
  "1/x", 
  4, 
  5, 
  6, 
  "-",
  "π",
  1, 
  2, 
  3, 
  "+",
  "toggle",
  "e", 
  0, 
  ".", 
  "=", 
];
const keyboard2 = [
  "AC", 
  "<-",
  "%",
  "x",
  7, 
  8, 
  9, 
  "-",
  4, 
  5, 
  6, 
  "+",
  1, 
  2, 
  3, 
  "/", 
  0, 
  ".", 
  "toggle",
  "=",
];

interface oldResultTypes {
  result: number
  caculation: string
}
function App() {
  const  [result, setResult] = useState<number>(0);
  const [oldResult, setOldResult] = useState<oldResultTypes[]>([]);
  const [visiOldResult,setVisiOldResult] = useState<boolean>(false)
  const [visiSupEL,setVisiSupEL] = useState<boolean>(false)
  const [toggleKeyboard, setToggleKeyboard] = useState<boolean>(false);
  const SpanRef = useRef<HTMLSpanElement>(document.createElement("span"))
  useEffect(() => {
    function handleRemove(e: KeyboardEvent) {
      if (SpanRef.current.innerHTML == "0" || SpanRef.current.innerHTML == "") SpanRef.current.innerHTML = '0'
      if (e.keyCode == 8) SpanRef.current.innerHTML = SpanRef.current.innerHTML.slice(0, -1);
    }
    document.addEventListener("keyup", handleRemove);
    return () => {
      document.removeEventListener("keyup", handleRemove);
    };
  }, [result,oldResult]);
  const handleNumPus = (subtrResult:string[]) => {
    const getSupELValue = SpanRef.current.getElementsByTagName("sup") ;
    if (subtrResult.length == 1) {
      const getSupELValuesub = SpanRef.current.getElementsByTagName("sup")[0];
      const value = Math.floor(
        parseFloat(
          subtrResult[0].split(`<sup>${getSupELValuesub.innerHTML}</sup>`)[0]
        )
      );
      let numResult = value;
      const substrLenth = Math.floor(parseFloat(getSupELValuesub.innerHTML));
      for (let i = 2; i <= substrLenth; i++) {
        numResult *= value;
      }
      saveValue(`${value}^ ${getSupELValuesub.innerHTML}`, numResult);
    }
    else {
      const arr = []
      for (let i = 0; i < subtrResult.length; i++){
        if (!isNaN(parseFloat(subtrResult[i])) == false) {
          arr.push(subtrResult[i]);
        } else {
          let subResult = parseFloat(subtrResult[i].slice(0, 1));
          for (let j = 0; j < getSupELValue.length ; j++) {
            for (let b = 2; b <= parseInt(getSupELValue[j].innerHTML); b++) {
              subResult *= parseFloat(subtrResult[i].slice(0, 1));
            }
            arr.push(subResult.toString());
            break;
          }
        }
      }
      handleCaculation(arr)
    }
  };
  const handleResult = () => {
    let subtrResult = SpanRef.current.innerHTML.split(" ");
    if (subtrResult[0] == "NaN") return;
    if (subtrResult[0].split("").includes("<" || ">")){
      handleNumPus(subtrResult)
      return;
    }
    handleCaculation(subtrResult)
  }
  function handleCaculation(subtrResult:string[]) {
    const pi = 3.14159265359;
    const e = 2.71828182846;
    let OldResult = 0;
    const caculationStr = subtrResult.join(" ");
    let NumInitial = 0;
    let count = 1;
    subtrResult.map((item:string, index:number) => {
      if (index == 0 && !isNaN(parseFloat(item)) == true) {
        setResult(parseFloat(item));
        NumInitial = parseFloat(item);
        OldResult = parseFloat(item);
      }
      else if (!isNaN(parseFloat(item)) == false) {
        switch (item) {
          case "+":
            setResult((prev) => prev + parseFloat(subtrResult[index + 1]));
            OldResult += parseFloat(subtrResult[index + 1]);
            break;
          case "-":
            setResult((prev) => prev - parseFloat(subtrResult[index + 1]));
            OldResult -= parseFloat(subtrResult[index + 1]);
            break;
          case "x":
            setResult((prev) => prev * parseFloat(subtrResult[index + 1]));
            OldResult *= parseFloat(subtrResult[index + 1]);
            break;
          case "/":
            setResult((prev) => prev / parseFloat(subtrResult[index + 1]));
            OldResult /= parseFloat(subtrResult[index + 1]);
            break;
          case "%":
            setResult((prev) => prev / 100);
            OldResult -= parseFloat(subtrResult[index + 1]);
            break;
          case "π":
            setResult((prev) => prev * pi);
            OldResult *= pi;
            break;
          case "e":
            setResult((prev) => prev * e);
            OldResult *= e;
            break;
          case "!":
            for (let i = 2; i <= Math.floor(OldResult); i++) {
              count *= i;
            }
            setResult(count)
            OldResult = count;
            break;
          case "log(":
            setResult(Math.log10(parseFloat(subtrResult[index + 1])));
            OldResult = Math.log10(parseFloat(subtrResult[index + 1]));
            break;
          case "ln(":
            setResult(Math.log(parseFloat(subtrResult[index + 1])));
            OldResult = Math.log(parseFloat(subtrResult[index + 1]));
            break;
          case "^":
            for (
              let i = 2;
              i <= Math.floor(parseFloat(subtrResult[index + 1]));
              i++
            ) {
              setResult((prev) => prev * NumInitial);
              OldResult *= NumInitial;
            }
            break;
        }
      }
    });
      saveValue(caculationStr, OldResult);
  }
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const supEL = document.createElement("sup");
    const value = e.currentTarget.value.toString();
    const getSupELValue =
      SpanRef.current.getElementsByTagName("sup").length > 1
        ? SpanRef.current.getElementsByTagName("sup")[
            SpanRef.current.getElementsByTagName("sup").length - 1
          ]
        : SpanRef.current.getElementsByTagName("sup")[0];
    const checkValue = SpanRef.current.innerHTML.trim();
    const LastElement =
      checkValue.slice(-1)
    switch (value) {
      case "AC":
        SpanRef.current.innerHTML = "0";
        setVisiSupEL(false);
        break;
      case "lg":
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != "0") {
          SpanRef.current.innerHTML += " x log(";
        } else {
          SpanRef.current.innerHTML = "log( ";
        }
        break;
      case "ln":
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != "0") {
          SpanRef.current.innerHTML += " x ln(";
        } else {
          SpanRef.current.innerHTML = "ln( ";
        }
        break;
      case "%":
        if (!checkOperation(LastElement, value)) return;
        break;
      case "x":
        if (!checkOperation(LastElement, value)) return;
        break;
      case '1/x':
        return;
          break
      case "(":
        if (LastElement == "(") return;
        if (!isNaN(parseFloat(LastElement)) == false) {
          SpanRef.current.innerHTML += " (";
          return
        };
        SpanRef.current.innerHTML += "x (";
        break;
      case ")":
        if (
          !isNaN(parseFloat(checkValue.slice(-1))) == false ||
          LastElement == "(" ||
          LastElement == ")"
        )return;
        SpanRef.current.innerHTML += ")";
        break;
      case "=":
        handleResult();
        break;
      case "/":
        if (checkOperation(LastElement, value) == false) return;
        break;
      case "2nd":
        return;
        break;
      case "Sin":
        return;
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != ".") {
          SpanRef.current.innerHTML += value;
        }
        break;
      case "Cos":
        return;
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != ".") {
          SpanRef.current.innerHTML += value;
        }
        break;
      case "/x":
        return;
        break;
      case "x^y":
        if (
          !isNaN(parseFloat(LastElement)) == true &&
          LastElement != "^" &&
          visiSupEL == false
    )   SpanRef.current.appendChild(supEL);
          setVisiSupEL(true);
        break;
      case "Tan":
        return;
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != ".") {
          SpanRef.current.innerHTML += value;
        }
        break;
      case ".":
        if (!isNaN(parseFloat(LastElement)) == true && LastElement != ".") {
          SpanRef.current.innerHTML += value;
        }
        break;
      case "Rad":
        e.currentTarget.innerHTML = "Deg";
        e.currentTarget.value = "Deg";
        break;
      case "Deg":
        e.currentTarget.innerHTML = "Rad";
        e.currentTarget.value = "Rad";
        break;
      case "toggle":
        setToggleKeyboard(!toggleKeyboard);
        break;
      case "<-":
        if (SpanRef.current.innerHTML.length == 0) {
          SpanRef.current.innerHTML = "0";
          setVisiSupEL(false);
          break;
        } else {
          SpanRef.current.innerHTML = checkValue.slice(0, -1);
          SpanRef.current.innerHTML = "0";
        }
        break;
      case "-":
        if (!checkOperation(LastElement, value)) return;
        break;
      case "x^y":
        if (visiOldResult == true) return;
        SpanRef.current.appendChild(supEL);
        break;
      case "x!":
        if (!checkOperation(LastElement, "!")) return;
        break;
      case "+":
        if (!checkOperation(LastElement, value)) return;
        break;
      case "π":
        if (!checkOperation(LastElement, value)) return;
        break;
      case "e":
        if (!checkOperation(LastElement, value)) return;
        break;
      default:
        if (visiSupEL == true) {
          getSupELValue.innerHTML += value;
          return;
        }
        if (LastElement == "e" || LastElement == "π") {
          SpanRef.current.innerHTML += " x " + value;
        } else if (checkValue != "0") {
          SpanRef.current.innerHTML += value;
          break;
        } else {
          SpanRef.current.innerHTML = value;
          break;
        }
    }
      
  }
  const getKeyboard = keyboard.map((item) => {
    const CheckButtonResult =
      item == "="
        ? "w-1/2 text-3xl   bg-orange-600 text-white "
        : "active:bg-white ";
    const isNumber = typeof item == "number" ? "text-black" : "text-gray-500";
    return (
      <button
        key={item}
        value={item}
        onClick={handleClick}
        className={`px-5 ${isNumber} ${CheckButtonResult} select-none outline-none active:shadow-lg py-[14px] w-1/5 my-0.5 rounded-full  font-semibold flex items-center justify-center`}
      >
        {item == "x/y" ? "x" : item}
        {item == "x/y" ? <sup>y</sup> : ""}
      </button>
    );
  });
  const getKeyboard2 = keyboard2.map((item) => {
    const CheckButtonResult =
      item == "="
        ? "w-1/4 text-3xl   bg-orange-600 text-white "
        : "active:bg-white w-1/4";
    const isNumber = typeof item == "number" ? "text-black" : "text-gray-500";
    return (
      <button
        key={item}
        value={item}
        onClick={handleClick}
        className={`px-5 ${isNumber} ${CheckButtonResult} select-none outline-none active:shadow-lg py-[14px] my-0.5 rounded-full  font-semibold flex items-center justify-center`}
      >
        {item}
      </button>
    );
  });

  const handleShowOldResult = () => setVisiOldResult(!visiOldResult)
  const saveValue = (caculationStr:string,OldResult:number) => {
     if (oldResult.length === 0) {
       setOldResult([
         {
           caculation: caculationStr,
           result: OldResult,
         },
       ]);
     } else {
       setOldResult((prev) => [
         ...prev,
         {
           caculation: caculationStr,
           result: OldResult,
         },
       ]);
     }
     SpanRef.current.innerHTML = OldResult.toString();
     setVisiSupEL(false);
  }
  const checkOperation = (LastElement: number | undefined | string, value: number | string) => {
    const CommenOperator = SpanRef.current.innerHTML
    setVisiSupEL(false)
    if (LastElement == value) return false;
    else if (LastElement != value) {
      if (value == 'x!')SpanRef.current.innerHTML = CommenOperator + `!`;
      else SpanRef.current.innerHTML = CommenOperator + ` ${value} `;
    }
  }
  const handleOldResult = (e:MouseEvent<HTMLSpanElement>) => {
    const value = e.currentTarget.textContent
    SpanRef.current.textContent = value;
    setVisiOldResult(false)
  };
  const handleOldCaculation = (e: MouseEvent<HTMLSpanElement>) => {
const value = e.currentTarget.textContent;
    SpanRef.current.textContent = value;
    setVisiOldResult(false);
  };
  return (
    <div className="text-xl font-bold flex  items-center justify-center">
      <div className="relative w-[23rem] animation duration-500  my-6 border bg-gray-50 border-gray-300 shadow-lg rounded-sm p-2  ">
        {visiOldResult && (
          <div className="absolute z-50 top-12 left-2  w-80 select-none bg-white shadow-lg rounded-md min-h-28 border border-gray-200 p-4">
            {oldResult.length === 0 ? (
              <p className="text-sm font-normal italic">
                kết quả các phép tính sẽ hiện ở đây
              </p>
            ) : (
              <div className="w-full text-sm h-full">
                {oldResult.map((item, index) => (
                  <p
                    key={index}
                    className="text-sm text-blue-600 font-normal flex items-center"
                  >
                    <p
                      className="hover:border border-gray-300 px-2 py-0.5 rounded-sm active:bg-gray-50 min-w-20"
                      onClick={handleOldCaculation}
                    >
                      {item.caculation}
                    </p>
                    <p className="text-lg text-gray-700 font-semibold px-2">
                      =
                    </p>
                    <span
                      className=" hover:border hover:border-gray-300 px-2 py-0.5 rounded-sm active:bg-gray-50 min-w-20"
                      onClick={handleOldResult}
                    >
                      {item.result}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="mb-2 outline-blue-300 text-lg font-bold border overflow-hidden   border-blue-200 w-full px-2 py-7 block bg-white shadow relative">
          <FontAwesomeIcon
            icon={faClock}
            className="text-[1.3rem] text-black cursor-pointer absolute top-4 left-3 "
            onClick={handleShowOldResult}
          ></FontAwesomeIcon>
          <span
            ref={SpanRef}
            className="absolute right-3 top-3 whitespace-nowrap "
          >
            {result}
          </span>
        </div>
        <div className="flex items-center flex-wrap ">{!toggleKeyboard ? getKeyboard : getKeyboard2}</div>
      </div>
    </div>
  );
}

export default App;
