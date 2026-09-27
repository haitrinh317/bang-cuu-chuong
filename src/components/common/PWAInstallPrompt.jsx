import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWA Install Prompt — hiển thị banner mời cài đặt ứng dụng
 * Tự động ẩn nếu user đã cài hoặc đã dismiss
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // iOS doesn't support beforeinstallprompt, show custom guide
      setTimeout(() => setShowPrompt(true), 3000);
      return;
    }

    // Listen for beforeinstallprompt (Android/Chrome/Edge)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Install Banner */}
      <div
        className="pwa-install-banner"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '420px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fff',
          fontFamily: "'Nunito', 'Quicksand', sans-serif",
          animation: 'slideUpFadeIn 0.4s ease-out',
        }}
      >
        {/* App Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Smartphone size={28} strokeWidth={2} color="#FEF08A" />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '2px',
          }}>
            📲 Cài lên máy nào!
          </div>
          <div style={{
            fontSize: '12px',
            opacity: 0.9,
            lineHeight: 1.3,
          }}>
            Chơi offline, nhanh hơn, như app thật!
          </div>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          style={{
            background: '#FEF08A',
            color: '#6B21A8',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: "'Nunito', sans-serif",
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Download size={16} strokeWidth={2.5} />
          Cài đặt
        </button>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
          }}
          aria-label="Đóng"
        >
          <X size={16} color="#fff" />
        </button>
      </div>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Nunito', sans-serif",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#7C3AED',
              marginBottom: '16px',
            }}>
              Cài đặt trên iPad/iPhone
            </h3>
            <div style={{
              fontSize: '14px',
              color: '#374151',
              lineHeight: 1.6,
              textAlign: 'left',
            }}>
              <p style={{ marginBottom: '12px' }}>
                <strong>Bước 1:</strong> Nhấn nút <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#F3F4F6',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '16px',
                }}>
                  ⬆️ Chia sẻ
                </span> ở thanh dưới Safari
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong>Bước 2:</strong> Kéo xuống chọn <strong>"Thêm vào Màn hình chính"</strong>
              </p>
              <p>
                <strong>Bước 3:</strong> Nhấn <strong>"Thêm"</strong> ở góc trên bên phải
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{
                marginTop: '20px',
                background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Hiểu rồi! ✨
            </button>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
