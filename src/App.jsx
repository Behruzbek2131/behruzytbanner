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

  // Haqiqiy YouTube o'lchamlari
  const YT_WIDTH = 2560;
  const YT_HEIGHT = 1440;
  const SAFE_WIDTH = 1546;
  const SAFE_HEIGHT = 423;

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
    // Rasmni Safe Area'ga nisbatan moslashtirish
    const scale = Math.min(SAFE_WIDTH / img.width, SAFE_HEIGHT / img.height);
    
    return {
      x: (YT_WIDTH - img.width * scale) / 2,
      y: (YT_HEIGHT - img.height * scale) / 2,
      width: img.width * scale,
      height: img.height * scale
    };
  };

  const download = () => {
    if (!stageRef.current) return;

    // MUHIM: pixelRatio orqali brauzerdagi kichik tasvirni 2560x1440 ga ko'paytiramiz
    const ratio = YT_WIDTH / containerWidth;
    
    const uri = stageRef.current.toDataURL({ 
      pixelRatio: ratio 
    });

    const link = document.createElement('a');
    link.download = `youtube-banner-${Date.now()}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>YouTube Banner Studio</h1>
        <p>Standart: {YT_WIDTH}x{YT_HEIGHT} px (Qora hoshiyali)</p>
      </div>

      <div className="controls-card">
        <label className="file-input">
          <div className="flex items-center justify-center gap-3">
            <Upload size={20} />
            <span>Rasm yuklash</span>
          </div>
          <input type="file" hidden onChange={handleUpload} accept="image/*" />
        </label>

        <button 
          onClick={download} 
          disabled={!imageUri} 
          className="download-btn"
        >
          <Download size={20} />
          HD Sifatda yuklab olish
        </button>
      </div>

      <div className="canvas-wrapper" ref={containerRef}>
        <Stage 
          width={containerWidth} 
          height={containerWidth * (YT_HEIGHT / YT_WIDTH)} 
          scaleX={containerWidth / YT_WIDTH} 
          scaleY={containerWidth / YT_WIDTH} 
          ref={stageRef}
        >
          <Layer>
            {/* 1. Asosiy fon - YouTube talab qilganidek qop-qora */}
            <Rect width={YT_WIDTH} height={YT_HEIGHT} fill="#000000" />
            
            {/* 2. Yuklangan rasm */}
            {img && <Image image={img} {...getImgProps()} />}

            {/* 3. Safe Area (Faqat yo'riqnoma uchun) */}
            <Rect 
              x={(YT_WIDTH - SAFE_WIDTH) / 2} 
              y={(YT_HEIGHT - SAFE_HEIGHT) / 2} 
              width={SAFE_WIDTH} 
              height={SAFE_HEIGHT} 
              stroke="#3b82f6" 
              strokeWidth={4}
              dash={[30, 30]}
              opacity={0.5}
            />
          </Layer>
        </Stage>
        
        {!imageUri && (
          <div className="safe-area-label">
            <ImageIcon size={40} style={{margin: '0 auto 10px', opacity: 0.5}} />
            <p>Rasm yuklang...</p>
          </div>
        )}
      </div>

      <div className="info-box">
        <p>✅ Rasm avtomatik ravishda 2560x1440 o'lchamga keltiriladi.</p>
        <p>✅ Chetlaridagi ortiqcha joylar qora rang bilan to'ldiriladi.</p>
      </div>
      <footer className="footer">
        <p>
          Created by <span className="dev-name">Behruzbek</span> | 
          Telegram Contact: <a href="https://t.me/Behruzchik_im" target="_blank" rel="noreferrer">
            Behruzchik_im
          </a>
        </p>
      </footer>
    </div>
    
  );
}


export default App;