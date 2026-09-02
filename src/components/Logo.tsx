import logoImg from '../imports/759849428_18097699628459197_5945281651113337474_n.jpg';

type Size = 'xs' | 'sm' | 'md' | 'lg';

const MARK_PX: Record<Size, number> = {
  xs: 36,
  sm: 52,
  md: 68,
  lg: 96,
};

const TEXT: Record<Size, { ikka: number; delmar: number; gap: number }> = {
  xs: { ikka: 13, delmar: 7,  gap: 10 },
  sm: { ikka: 17, delmar: 9,  gap: 12 },
  md: { ikka: 22, delmar: 11, gap: 14 },
  lg: { ikka: 30, delmar: 15, gap: 18 },
};

interface LogoProps {
  size?: Size;
  variant?: 'dark' | 'light' | 'gold';
  markOnly?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', variant = 'dark', markOnly = false, className = '' }: LogoProps) {
  const px = MARK_PX[size];
  const t = TEXT[size];
  const textColor = variant === 'light' ? '#F7F3EC' : variant === 'gold' ? '#C4893A' : '#0E0C0A';

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ gap: t.gap }}>
      <img
        src={logoImg}
        alt="IKKA DEL MAR"
        width={px}
        height={px}
        className="rounded-full object-cover shrink-0"
        style={{ width: px, height: px }}
      />
      {!markOnly && (
        <div className="flex flex-col leading-none" style={{ color: textColor }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: t.ikka,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            IKKA
          </span>
          <span style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: t.delmar,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            fontWeight: 300,
            marginTop: '2px',
          }}>
            DEL MAR
          </span>
        </div>
      )}
    </div>
  );
}
