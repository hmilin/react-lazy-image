import { useRef } from "react";
import "./App.css";

// import LazyImage from "react-lazy-image";
import LazyImage from ".";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <h1>图片懒加载使用示例</h1>
      <section>
        <h2>不指定容器</h2>
        <div style={{ height: 1000 }}>向下滚动👇</div>
        <LazyImage src="/vite.svg" />
      </section>
      <section>
        <h2>在指定容器中滚动</h2>
        <div id="lazyContainer" className="lazy-container" ref={containerRef}>
          <LazyImage src="/vite.svg" container={containerRef} height="200" />
        </div>
      </section>
    </div>
  );
}

export default App;
