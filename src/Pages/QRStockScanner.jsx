import React, { useRef, useState } from 'react';
import SlideBare from '../Components/SlideBare.jsx';
import ThemeToggle from '../Components/ThemeToggle.jsx';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  QrCode,
  CheckCircle2,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  X,
} from 'lucide-react';

export default function QRStockScanner() {
  const scannerRef = useRef(null);
  const scannerRegionId = 'qr-reader-region';

  const [transactionType, setTransactionType] = useState('input');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Ready to scan');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      //
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    setLastScannedCode(decodedText);
    setScanMessage('QR code scanned successfully');
    setErrorMessage('');

    const newTransaction = {
      id: Date.now(),
      code: decodedText,
      type: transactionType,
      date: new Date().toLocaleString(),
      status: 'Success',
    };

    setRecentTransactions((prev) => [newTransaction, ...prev].slice(0, 6));
    await stopScanner();
  };

  const startScanner = async () => {
    setErrorMessage('');
    setScanMessage('Initializing camera...');

    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setErrorMessage('No camera found');
        setScanMessage('Unable to start scanner');
        return;
      }

      const cameraId = devices[0].id;
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.777,
        },
        handleScanSuccess,
        () => {},
      );

      setIsScanning(true);
      setScanMessage('Scanner is active');
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to start camera scanner. Check camera permission.');
      setScanMessage('Ready to scan');
      setIsScanning(false);

      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch {
          //
        }
        scannerRef.current = null;
      }
    }
  };

  const handleStop = async () => {
    await stopScanner();
    setScanMessage('Scanner stopped');
    setErrorMessage('');
  };

  return (
    <div className="app-layout">
      <SlideBare activeLabel="QR Scanner" />

      <main className="app-main">
        <div className="page-shell">
          <div className="page-topbar">
            <div>
              <h1 className="page-title">QR Stock Scanner</h1>
              <p className="page-subtitle">Scan QR codes to manage inventory input and output</p>
            </div>
            <ThemeToggle />
          </div>

          <section className="scanner-section">
            <h3 className="scanner-section-title">Select Transaction Type</h3>

            <div className="scanner-type-grid">
              <button
                type="button"
                className={`scanner-type-card ${transactionType === 'input' ? 'active input' : ''}`}
                onClick={() => setTransactionType('input')}
              >
                <ArrowDownToLine size={20} />
                <div>
                  <strong>INPUT</strong>
                  <span>Add to Stock</span>
                </div>
              </button>

              <button
                type="button"
                className={`scanner-type-card ${
                  transactionType === 'output' ? 'active output' : ''
                }`}
                onClick={() => setTransactionType('output')}
              >
                <ArrowUpFromLine size={20} />
                <div>
                  <strong>OUTPUT</strong>
                  <span>Remove from Stock</span>
                </div>
              </button>
            </div>
          </section>

          <section className="scanner-section">
            <h3 className="scanner-section-title">Scan QR Code</h3>

            <div className="scanner-box">
              {!isScanning && (
                <div className="scanner-placeholder">
                  <div className="scanner-camera-icon">
                    <Camera size={42} />
                  </div>

                  <p className="scanner-status-text">{scanMessage}</p>

                  <button type="button" className="scanner-start-btn" onClick={startScanner}>
                    <QrCode size={16} />
                    <span>Start Scanning</span>
                  </button>

                  {errorMessage && <div className="scanner-error-badge">{errorMessage}</div>}

                  {lastScannedCode && (
                    <div className="scanner-last-result">
                      <CheckCircle2 size={16} />
                      <span>Last scanned: {lastScannedCode}</span>
                    </div>
                  )}
                </div>
              )}

              <div
                id={scannerRegionId}
                className={`scanner-reader ${isScanning ? 'active' : ''}`}
              />

              {isScanning && (
                <div className="scanner-stop-wrap">
                  <button type="button" className="scanner-stop-btn" onClick={handleStop}>
                    <X size={16} />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="scanner-section">
            <div className="scanner-history-header">
              <h3 className="scanner-section-title">
                <History size={16} />
                <span>Recent Transactions</span>
              </h3>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="scanner-empty-history">No transactions yet</div>
            ) : (
              <div className="scanner-history-list">
                {recentTransactions.map((item) => (
                  <div key={item.id} className="scanner-history-card">
                    <div className="scanner-history-top">
                      <strong>{item.code}</strong>
                      <span
                        className={`scanner-history-type ${
                          item.type === 'input' ? 'input' : 'output'
                        }`}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="scanner-history-meta">
                      <span>{item.date}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
