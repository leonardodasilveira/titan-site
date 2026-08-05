import { ImageResponse } from 'next/og';

export const alt = 'Titan Inc — progressão aferida como instrumento';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        color: 'rgb(232, 234, 240)',
        background:
          'radial-gradient(ellipse at 72% 42%, rgb(22, 32, 58), rgb(16, 21, 31) 48%, rgb(11, 13, 18) 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          background:
            'linear-gradient(100deg, rgb(11, 13, 18) 0%, rgba(11, 13, 18, .76) 48%, transparent 82%)',
        }}
      />
      <div
        style={{
          width: 680,
          padding: '118px 0 70px 84px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          TITAN <span style={{ marginLeft: 12, color: 'rgb(120, 216, 192)' }}>INC</span>
        </div>
        <div
          style={{ width: 355, height: 1, marginTop: 8, background: 'rgba(232, 234, 240, .18)' }}
        />
        <div style={{ marginTop: 84, fontSize: 30, lineHeight: 1.3, color: 'rgb(154, 161, 177)' }}>
          Endgame sem abrir mão da vida real.
        </div>
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            fontSize: 18,
            letterSpacing: '.14em',
            color: 'rgb(120, 216, 192)',
          }}
        >
          PROGRESSÃO · SEM LEITURA
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 74,
          top: 118,
          width: 340,
          height: 340,
          borderRadius: '50%',
          border: '2px solid rgb(35, 39, 51)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 38% 28%, rgb(22, 32, 58), rgb(16, 21, 31) 58%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 33,
            left: 167,
            width: 2,
            height: 38,
            background: 'rgb(35, 39, 51)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 84,
            bottom: 62,
            width: 2,
            height: 30,
            transform: 'rotate(-45deg)',
            background: 'rgb(35, 39, 51)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 84,
            bottom: 62,
            width: 2,
            height: 30,
            transform: 'rotate(45deg)',
            background: 'rgb(35, 39, 51)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            —/—
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 15,
              letterSpacing: '.14em',
              color: 'rgb(120, 216, 192)',
            }}
          >
            SEM LEITURA
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 84,
          right: 84,
          bottom: 45,
          height: 1,
          background: 'rgba(232, 234, 240, .12)',
        }}
      />
    </div>,
    size,
  );
}
