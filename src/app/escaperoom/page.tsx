"use client";
import { useMemo, useState, useRef, useEffect } from "react";

export default function Page() {
  const [stage, setStage] = useState(0);
  const [digits, setDigits] = useState<number[]>([]);
  const [scene, setScene] = useState<"room" | "lock">("room");
  const give = (d: number) => { setDigits(x => [...x, d]); setStage(s => s + 1); };
  //Keypad states
  const [entry, setEntry] = useState("");
  const [win, setWin]   = useState(false);    
  const code = digits.join("") || "314";
  
  const clr = () => setEntry("");
  const add = (d: string) => setEntry(s => (s + d).slice(0, 3));
  //Checks if code on keypad is the correct code
  const submitCode = () => {
    if (entry === code) setWin(true);
    else clr();
  };
  //timer states
  const [left, setLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  //Timer system, takes user input in minutes and counts down to 0
  useEffect(() => {
    if (typeof window === "undefined" || timerRef.current) return;
    const raw = window.prompt("Minutes?", "5"); //Ask user to manually set the timer in minutes
    const mins = Math.max(1, Math.floor(Number(raw) || 5));
    setLeft(mins * 60);
    timerRef.current = window.setInterval(() => {
      setLeft(s => {
        if (s <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div style={{
      position:"relative",
      minHeight:"800px", maxWidth:"1200px", width:"100%", margin:"0 auto",
      backgroundImage: `url(${scene === "room" ? "/EscapeRoom.png" : "/Lock.png"})`,
      backgroundSize:"cover", backgroundPosition:"center", userSelect:"none"
      }}>
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", color: "#ffffff",
      }}>
        {/* Timer display on top middle */}
        {mm}:{ss}
      </div>
      {/* Monitor screen */}
      {scene == "room" && (
      <div style={{
        position:"absolute", left:"26.5%", top:"37%", width:"34%", height:"30%",
        background:"radial-gradient(ellipse at 50% 45%, rgba(8,18,36,0.9) 0%, rgba(5,10,20,0.96) 70%, rgba(2,6,12,1) 100%)",
        boxShadow:"0 0 140px rgba(60,140,255,0.22) inset, 0 0 22px rgba(40,90,210,0.22)",
        overflow:"hidden"
      }}>
        {/* content layer */}
        <div style={{
          position:"absolute", inset:0, padding:"12px", color:"#9fd4ff", fontFamily:"monospace", fontSize:'10px', overflowY:"scroll", scrollbarGutter:"stable", minHeight:0 
        }}>
          {/*The stages appear once the previous one has been completed*/}
          {stage===0 && <Stage1 onDone={()=>give(3)} />}
          {stage===1 && <Stage2 onDone={()=>give(1)} />}
          {stage===2 && <Stage3 onDone={()=>give(4)} />}
          {stage>=3 && <AllDone digits={digits} />}
        </div>
      </div>)}
      {/*Once stage 3 has been completed then the lock on the door is clickable*/}
      {stage >= 3 && (
      <button
        onClick={() => setScene("lock")}
        style={{
          position: "absolute", left: "64%", top: "33%", width: "6.5%", height: "12%", background: "transparent", border: 'none', cursor: "pointer", zIndex: 5,
        }}
      />)}

      {/* LOCK KEYPAD OVERLAY */}
      {scene === "lock" && !win && (
        //Center keyboard on screen
        <div style={{
          position:"absolute", inset:0, display:"grid", placeItems:"center",  zIndex: 10
        }}>

          <div style={{
            width: 280, background:"rgba(5,10,20,.92)",
            border:"1px solid rgba(160,200,255,.25)", borderRadius:10,
            padding:16, color:"#cfe8ff",
          }}>
            <div style={{textAlign:"center", fontWeight:800, marginBottom:8}}>Enter Code</div>

            {/* display */}
            <div style={{
              border:"1px solid rgba(160,200,255,.35)", borderRadius:6,
              padding:"10px 8px", textAlign:"center",
              letterSpacing:"6px", fontWeight:900, marginBottom:10
            }}>
              {entry || "— — —"}
            </div>

            {/* Generate Keypad*/}
            <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8}}>
              {["1","2","3","4","5","6","7","8","9","C","0","OK"].map(lbl => (
                <button
                  key={lbl}
                  onClick={() => (lbl==="C" ? clr() : lbl==="OK" ? submitCode() : add(lbl))}
                  style={{padding:"10px 0"}}
                >
                  {lbl}
                </button>
              ))}
            </div>

          </div>
        </div>)}
        
        {/* You Escaped message that appears once correct code is entered*/}
        {scene === "lock" && win && (
        <div style={{
          position:"absolute", inset:0, display:"grid", placeItems:"center",
          background:"rgba(0,0,0,0.45)", zIndex: 11
        }}>
          <div style={{
            background:"rgba(5,10,20,.96)", border:"1px solid rgba(160,200,255,.3)",
            borderRadius:12, padding:"20px 24px", color:"#cfe8ff", textAlign:"center",
          }}>
            <div style={{fontWeight:900, fontSize:22, marginBottom:8}}>You escaped!</div>
            <div style={{opacity:.9, marginBottom:12}}>Code accepted: {code}</div>
          </div>
        </div>)}

    </div>
  );
}

/* ------------ STAGE 1: format code ------------ */

function Stage1({ onDone }: { onDone: () => void }) {
  const [src, setSrc] = useState(`function unlock ( ){console . log ("Escape Room")}`);
  const [showError, setShowError] = useState(false);
//Check if the user's edits are correct and allow for any spaces in valid areas for example indentation
 const check = () => {
  const ok = /^\s*function\s+unlock\s*\(\s*\)\s*\{\s*console\.log\(\s*["']Escape Room["']\s*\);\s*\}\s*$/.test(src);
  if (ok) {
    setShowError(false);
    onDone();
  } else {
    setShowError(true);
  }
};
  return (
    <div>
      <div style={{opacity:.9, marginBottom:6, fontWeight:700}}>Stage 1 — Format the broken code</div>

      {/* textarea styled as on-screen text */}
      <textarea
        value={src}
        onChange={e => { setSrc(e.target.value); if (showError) setShowError(false); }}
        rows={4}
        style={{
          width:"100%",
          background:"transparent",
          color:"#9fd4ff",
          border:"1px solid rgba(160,200,255,.3)", padding:"8px",
          outline:"none",
          resize:"none",
          caretColor:"#bfe3ff"
        }}
      />

      {/*Submit button with error message that displays if true*/}
      <button onClick={check} style={{marginTop:8}}>Submit</button>
      {showError && <span style={{ marginLeft: 10, color: "#ffb3b3" }}>Incorrect — try again.</span>}


    </div>
  );
}

/* ------------ STAGE 2: generate 0-1000 integers ------------ */

function Stage2({ onDone }: { onDone: () => void }) {
  //placeholder text for input
  const [code, setCode] = useState<string>(
    `let result = [];
    // Write JS to generate the numbers 0 - 1000 into result`
  );
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    setShowError(false);
    try {
      // Execute exactly what the user wrote, then try to read `result`
      const runner = new Function(`
        "use strict";
        ${code}
        try { return result; } catch (e) { return undefined; }
      `);

      const out = runner();
      //Ensure output is in an array and that the length is equal to exactly 1000
      const isArray = Array.isArray(out);
      const correctLen = isArray && out.length === 1001;
      //Ensure every value is an integer
      const allNums =
        correctLen && out.every((v: any, i: number) => typeof v === "number" && v === i);
       
      //If all checks pass then stage is done
      if (allNums) {
        onDone();
      } else {
        setShowError(true);
      }
    } catch (e: any) {
      //If any errors are found error message is displayed
      setShowError(true);
    }
  };

  return (
    <div>
      <div style={{ opacity: .9, marginBottom: 6, fontWeight: 700 }}>
        Stage 2 — Generate numbers from 0 - 1000
      </div>

      <textarea
        value={code}
        onChange={(e) => { setCode(e.target.value); if (showError) setShowError(false); }}
        rows={8}
        style={{
          width: "100%", height: '150px',
          background: "transparent",
          color: "#9fd4ff",
          border: "1px solid rgba(160,200,255,.3)",
          outline: "none",
          resize: "none",
          padding: "8px",
        }}
      />

      {/*Submit button with error message that displays if true*/}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={handleSubmit}>Submit</button>
        {showError && (
          <span style={{ color: "#ffb3b3", opacity: .95 }}>
            Incorrect — try again.
          </span>
        )}
      </div>
    </div>
  );
}


/* ------------ STAGE 3: CSV -> JSON format conversion ------------ */

function Stage3({ onDone }: { onDone: () => void }) {
  // INPUT: code editor (reads inputCsv, sets outputJson)
  const [showError, setShowError] = useState(false);
  const [code, setCode] = useState<string>(
    `/*Convert the following CSV to JSON
    const inputCsv = name,age
      Amy,21
      Bob,19
      Cara,20 
    
    inputCsv has been defined
    you must return outputJson
    */

    // your code here
    `
      );

  // Fixed CSV provided to the student's code
  const inputCsv = `name,age
    Amy,21
    Bob,19
    Cara,20`;

  const handleSubmit = () => {
    setShowError(false);
    try {
      const runner = new Function(`
        "use strict";
        const inputCsv = ${JSON.stringify(inputCsv)};
        ${code}
        return typeof outputJson === "string" ? outputJson : "";
      `);

      const produced = runner();

      // Validate JSON shape
      let parsed: any;
      // Check if the outputJson coded by user is actual JSON
      try { parsed = JSON.parse(produced); } catch { throw new Error("bad json"); }
      //If it is then it must be an array to continue
      const ok = Array.isArray(parsed)
      //Checks if the array length is 3 or more becuase of the fixed CSV
        && parsed.length >= 3
        && parsed.every((row: any) => row && typeof row === "object" && "name" in row && "age" in row);

      if (ok) onDone();
      else setShowError(true);
    } catch {
      //if the JSON output is not valid then show the error
      setShowError(true);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 6, fontWeight: 700 }}>
        Stage 3 — Write code to convert CSV → JSON
      </div>
      <textarea
        value={code}
        onChange={e => { setCode(e.target.value); if (showError) setShowError(false); }}
        rows={12}
        style={{
          width:"100%", height:"180px",
          background:"transparent",
          color:"#9fd4ff",
          border:"1px solid rgba(160,200,255,.3)",
          outline:"none",
          resize:"vertical",
          padding:"8px",
        }}
      />

      {/*Submit button with error message that displays if true*/}
      <div style={{ marginTop: 8, display:"flex", alignItems:"center"}}>
        <button onClick={handleSubmit}>Submit</button>
        {showError && (
          <span style={{ color:"#ffb3b3", opacity:.95 }}>
            Incorrect — try again.
          </span>
        )}
      </div>
    </div>
  );
}



function AllDone({ digits }: { digits: number[] }) {
  return (
    //Once all stages are complete display the code to unlock the door 
    <div
      style={{
        position: "absolute",
        display: "grid",
        placeItems: "center",
        padding: "12px",
        color: "#bfe3ff",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ opacity: 0.9, marginBottom: 8, fontWeight: 700 }}>
          All stages complete
        </div>
        <div
          style={{
            fontWeight: 900,
            letterSpacing: "12px",
            fontSize: 36,
            textShadow: "0 0 12px rgba(90,150,255,.25)",
          }}
        >
          {digits.join(" ")}
        </div>
        <div style={{ opacity: 0.85, marginTop: 10 }}>
          Enter the combination on the door keypad to escape.
        </div>
      </div>
    </div>
  );
}
