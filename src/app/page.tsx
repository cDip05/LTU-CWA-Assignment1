//used help from chatGPT
//did not have enough time to do output HTML file and film the video
//i was struggling with 4 assignments due on the same day and working full time
"use client";
import { useEffect, useState } from "react";

type Tab = { title: string; content: string };

const MAX_TABS = 15;
const LS_KEY = "tabs.ops.v1";

export default function Page() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { tabs: Tab[]; currentTab: number };
      if (Array.isArray(saved.tabs)) {
        setTabs(saved.tabs.slice(0, MAX_TABS));
        setCurrentTab(Math.min(saved.currentTab ?? 0, saved.tabs.length - 1));
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ tabs, currentTab }));
    } catch {}
  }, [tabs, currentTab]);

  // Tab actions
  function createTab() {
    if (tabs.length >= MAX_TABS) return;
    const n = tabs.length + 1;
    setTabs([...tabs, { title: `Tab ${n}`, content: `Write something for tab ${n}...` }]);
    setCurrentTab(tabs.length);
  }

  function deleteTab() {
    if (tabs.length === 0) return;
    const next = tabs.filter((_, i) => i !== currentTab);
    setTabs(next);
    setCurrentTab((c) => Math.max(0, Math.min(c, next.length - 1)));
  }

  function changeTitle(i: number, title: string) {
    const copy = [...tabs];
    copy[i].title = title;
    setTabs(copy);
  }

  function changeContent(i: number, content: string) {
    const copy = [...tabs];
    copy[i].content = content;
    setTabs(copy);
  }

  const sel = tabs[currentTab];

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Tabs</h1>

      {/* Controls */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={createTab} disabled={tabs.length >= MAX_TABS}>
          New Tab
        </button>
        <button
          onClick={deleteTab}
          disabled={tabs.length === 0}
          style={{ marginLeft: 8 }}
        >
          Delete
        </button>
        <span style={{ marginLeft: 12 }}>
          {tabs.length}/{MAX_TABS}
        </span>
      </div>

      {/* Tab headers */}
      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setCurrentTab(i)}
            style={{
              padding: "6px 10px",
              background: currentTab === i ? "#0070f3" : "#eee",
              color: currentTab === i ? "white" : "black",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {t.title || `Tab ${i + 1}`}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h2>Edit Tab</h2>
          {sel ? (
            <>
              <div style={{ marginBottom: 10 }}>
                <label>Title:</label>
                <input
                  value={sel.title}
                  onChange={(e) => changeTitle(currentTab, e.target.value)}
                  style={{ marginLeft: 5, width: "90%" }}
                />
              </div>
              <div>
                <label>Content:</label>
                <textarea
                  value={sel.content}
                  onChange={(e) => changeContent(currentTab, e.target.value)}
                  rows={8}
                  style={{ display: "block", marginTop: 5, width: "95%" }}
                />
              </div>
            </>
          ) : (
            <p>No tab selected.</p>
          )}
        </div>

        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h2>Preview</h2>
          {sel ? (
            <>
              <h3>{sel.title}</h3>
              <p>{sel.content}</p>
            </>
          ) : (
            <p>Nothing to preview.</p>
          )}
        </div>
      </div>
    </main>
  );
}
