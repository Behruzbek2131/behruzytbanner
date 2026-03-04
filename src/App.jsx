import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image } from 'react-konva';
import useImage from 'use-image';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';
import './App.css';

function App() {
  const [imageUri, setImageUri] = useState(null);
  const [img] = useImage(imageUri);
  const [containerWidth, setContainerWidth] = useState(800);
  const stageRef = useRef(null);
  const containerRef = useRef(null);

  // Mobil qurilmalarda canvas o'lchamini moslashtirish
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUri(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getImgProps = () => {
    if (!img) return {};
    const safeW = 1546;
    const safeH = 423;
    const scale = Math.min(safeW / img.width, safeH / img.height);
    
    return {
      x: (2560 - img.width * scale) / 2,
      y: (1440 - img.height * scale) / 2,
      width: img.width * scale,
      height: img.height * scale
    };
  };

  const download = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    const link = document.createElement('a');
    link.download = 'yt-banner-pro.png';
    link.href = uri;
    link.click();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>YouTube Banner Resizer</h1>
        <p>Rasmingizni avtomat moslang (Safe Area)</p>
      </div>

      <div className="controls-card">
        <label className="file-input">
          <div className="flex items-center justify-center gap-3">
            <Upload size={20} />
            <span>Rasm tanlash</span>
          </div>
          <input type="file" hidden onChange={handleUpload} accept="image/*" />
        </label>

        <button 
          onClick={download} 
          disabled={!imageUri} 
          className="download-btn"
        >
          <Download size={20} />
          PNG Yuklab olish
        </button>
      </div>

      <div className="canvas-wrapper" ref={containerRef}>
        <Stage 
          width={containerWidth} 
          height={containerWidth * (1440/2560)} 
          scaleX={containerWidth/2560} 
          scaleY={containerWidth/2560} 
          ref={stageRef}
        >
          <Layer>
            {/* Fon doim qora */}
            <Rect width={2560} height={1440} fill="#000000" />
            
            {img && <Image image={img} {...getImgProps()} />}

            {/* Safe Area ko'rsatkichi */}
            <Rect 
              x={(2560-1546)/2} 
              y={(1440-423)/2} 
              width={1546} 
              height={423} 
              stroke="#3b82f6" 
              strokeWidth={5}
              dash={[40, 40]}
              opacity={0.4}
            />
          </Layer>
        </Stage>
        {!imageUri && (
          <div className="safe-area-label">
            <ImageIcon size={48} style={{margin: '0 auto 10px'}} />
            Prevyu bu yerda ko'rinadi
          </div>
        )}
      </div>
      
      <p style={{marginTop: '20px', fontSize: '12px', opacity: 0.5}}>
        O'lcham: 2560 x 1440 px | Format: PNG
      </p>
    </div>
  );
}

export default App;