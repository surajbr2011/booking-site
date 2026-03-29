export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <title>Under Maintenance — The Exotica Agonda</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background: #020617;
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
          }
          .glow1 {
            position: absolute; top: -20%; right: -10%;
            width: 60%; height: 60%;
            background: rgba(30,129,176,0.18);
            border-radius: 50%;
            filter: blur(120px);
            animation: pulse 3s ease-in-out infinite;
          }
          .glow2 {
            position: absolute; bottom: -10%; left: -5%;
            width: 40%; height: 40%;
            background: rgba(59,130,246,0.1);
            border-radius: 50%;
            filter: blur(100px);
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
          }
          .card {
            position: relative; z-index: 10;
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 32px;
            padding: 60px 48px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          }
          .icon-wrap {
            display: inline-flex;
            width: 80px; height: 80px;
            background: linear-gradient(135deg, #1e81b0, #2563eb);
            border-radius: 24px;
            align-items: center;
            justify-content: center;
            margin-bottom: 28px;
            font-size: 36px;
            box-shadow: 0 16px 40px rgba(30,129,176,0.3);
          }
          h1 {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -0.5px;
            margin-bottom: 12px;
            color: white;
          }
          p {
            color: rgba(255,255,255,0.45);
            font-size: 14px;
            font-weight: 500;
            line-height: 1.7;
            margin-bottom: 32px;
          }
          .divider {
            height: 1px;
            background: rgba(255,255,255,0.06);
            margin: 28px 0;
          }
          .contact {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255,255,255,0.2);
          }
          .contact a {
            color: #1e81b0;
            text-decoration: none;
          }
          .dots {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-bottom: 32px;
          }
          .dot {
            width: 8px; height: 8px;
            background: #1e81b0;
            border-radius: 50%;
            animation: bounce 1.2s ease-in-out infinite;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(1); opacity: 0.6; }
            40% { transform: scale(1.5); opacity: 1; }
          }
        `}</style>
      </head>
      <body>
        <div className="glow1" />
        <div className="glow2" />
        <div className="card">
          <div className="icon-wrap">🔧</div>
          <h1>Under Maintenance</h1>
          <p>
            We are currently performing scheduled maintenance to improve your experience.
            The Exotica Agonda will be back online shortly.
          </p>
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
          <div className="divider" />
          <p className="contact">
            For urgent inquiries, contact us at{' '}
            <a href="tel:+919876543210">+91 98765 43210</a>
          </p>
        </div>
      </body>
    </html>
  );
}
