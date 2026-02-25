import React from 'react';
import { Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Ellipse,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

/** Front-facing wheel (for front/back views) */
const WheelFace = ({ cx, cy }: { cx: number; cy: number }) => (
  <G>
    {/* Tyre */}
    <Circle cx={cx} cy={cy} r={26} fill="#111" stroke="#000" strokeWidth={2.5} />
    {/* Rim */}
    <Circle cx={cx} cy={cy} r={18} fill="#2A2A2A" stroke="#444" strokeWidth={1.5} />
    <Circle cx={cx} cy={cy} r={10} fill="#3A3A3A" />
    {/* Spokes */}
    <Line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} stroke="#777" strokeWidth={3} />
    <Line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} stroke="#777" strokeWidth={3} />
    <Line x1={cx - 13} y1={cy - 13} x2={cx + 13} y2={cy + 13} stroke="#666" strokeWidth={2} opacity={0.8} />
    <Line x1={cx + 13} y1={cy - 13} x2={cx - 13} y2={cy + 13} stroke="#666" strokeWidth={2} opacity={0.8} />
    {/* Hub */}
    <Circle cx={cx} cy={cy} r={5} fill="#555" />
    {/* Highlight */}
    <Ellipse cx={cx - 7} cy={cy - 7} rx={7} ry={5} fill="#FFF" opacity={0.08} />
  </G>
);

/* -----------------------------
   SIDE VIEW (your original)
------------------------------ */
export const CarSideView = () => (
  <Svg width={width - 40} height={280} viewBox="0 0 450 280">
    <Defs>
      <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#42A5F5" stopOpacity="1" />
        <Stop offset="100%" stopColor="#1E88E5" stopOpacity="1" />
      </LinearGradient>
      <LinearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#B3E5FC" stopOpacity="0.8" />
        <Stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.5" />
      </LinearGradient>
    </Defs>

    {/* Shadow */}
    <Ellipse cx="225" cy="260" rx="180" ry="12" fill="#000" opacity="0.15" />

    {/* Main body */}
    <Path
      d="M 70 200 Q 70 140 100 100 Q 130 70 225 70 Q 320 70 350 100 Q 380 140 380 200 Q 380 240 360 250 Q 90 250 70 200 Z"
      fill="url(#bodyGradient)"
      stroke="#0D47A1"
      strokeWidth="2"
    />

    {/* Roof */}
    <Path
      d="M 110 100 Q 130 60 225 50 Q 320 60 340 100 Z"
      fill="#1976D2"
      stroke="#0D47A1"
      strokeWidth="1.5"
    />

    {/* Windshield */}
    <Path
      d="M 120 100 Q 140 65 225 60 Q 310 65 330 100 Z"
      fill="url(#windowGradient)"
      stroke="#0277BD"
      strokeWidth="1.5"
      opacity="0.85"
    />

    {/* Side window */}
    <Path
      d="M 165 95 Q 180 55 280 60 Q 295 95 290 120 Z"
      fill="url(#windowGradient)"
      stroke="#0277BD"
      strokeWidth="1.5"
      opacity="0.7"
    />

    {/* Door line */}
    <Path d="M 200 100 Q 200 200 200 245" stroke="#0D47A1" strokeWidth="1.5" fill="none" opacity="0.4" />

    {/* Headlight */}
    <Circle cx="85" cy="130" r="16" fill="#FFF8E1" stroke="#FFC107" strokeWidth="2" />
    <Circle cx="85" cy="130" r="12" fill="#FFEB3B" opacity="0.6" />

    {/* SIDE wheels (side-on) */}
    <G>
      <Circle cx="120" cy="245" r="28" fill="#1A1A1A" stroke="#000" strokeWidth="2.5" />
      <Circle cx="120" cy="245" r="22" fill="#2A2A2A" />
      <Circle cx="120" cy="245" r="16" fill="#3A3A3A" />
      <Line x1="120" y1="217" x2="120" y2="273" stroke="#666" strokeWidth="3" />
      <Line x1="92" y1="245" x2="148" y2="245" stroke="#666" strokeWidth="3" />
      <Circle cx="120" cy="245" r="8" fill="#555" />
    </G>

    <G>
      <Circle cx="330" cy="245" r="28" fill="#1A1A1A" stroke="#000" strokeWidth="2.5" />
      <Circle cx="330" cy="245" r="22" fill="#2A2A2A" />
      <Circle cx="330" cy="245" r="16" fill="#3A3A3A" />
      <Line x1="330" y1="217" x2="330" y2="273" stroke="#666" strokeWidth="3" />
      <Line x1="302" y1="245" x2="358" y2="245" stroke="#666" strokeWidth="3" />
      <Circle cx="330" cy="245" r="8" fill="#555" />
    </G>

    {/* Orange bumper */}
    <Rect x="60" y="200" width="15" height="20" fill="#FF6F00" stroke="#E65100" strokeWidth="1" rx="2" />
    <Rect x="375" y="200" width="15" height="20" fill="#FF6F00" stroke="#E65100" strokeWidth="1" rx="2" />
  </Svg>
);

/* -----------------------------
   FRONT VIEW (realistic + front wheels)
------------------------------ */
export const CarFrontView = () => (
  <Svg width={width - 40} height={280} viewBox="0 0 420 280">
    <Defs>
      <LinearGradient id="frontBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#4FC3F7" stopOpacity="1" />
        <Stop offset="100%" stopColor="#1565C0" stopOpacity="1" />
      </LinearGradient>

      <LinearGradient id="frontGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#E1F5FE" stopOpacity="0.8" />
        <Stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.35" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="210" cy="255" rx="160" ry="12" fill="#000" opacity="0.14" />

    <Path
      d="M 70 165
         Q 78 105 120 85
         Q 165 58 210 58
         Q 255 58 300 85
         Q 342 105 350 165
         Q 352 198 335 212
         Q 310 232 210 235
         Q 110 232 85 212
         Q 68 198 70 165 Z"
      fill="url(#frontBody)"
      stroke="#0D47A1"
      strokeWidth="2.5"
    />

    {/* Windshield */}
    <Path
      d="M 130 95
         Q 165 62 210 60
         Q 255 62 290 95
         Q 260 110 210 112
         Q 160 110 130 95 Z"
      fill="url(#frontGlass)"
      stroke="#0277BD"
      strokeWidth="1.5"
      opacity="0.9"
    />

    {/* Headlights */}
    <Path
      d="M 95 135
         Q 110 120 135 120
         Q 155 121 165 135
         Q 150 150 120 150
         Q 102 150 95 135 Z"
      fill="#FFFDE7"
      stroke="#FFC107"
      strokeWidth="2"
    />
    <Path
      d="M 255 135
         Q 265 121 285 120
         Q 310 120 325 135
         Q 318 150 300 150
         Q 270 150 255 135 Z"
      fill="#FFFDE7"
      stroke="#FFC107"
      strokeWidth="2"
    />

    {/* Grille */}
    <Path
      d="M 150 165
         Q 210 148 270 165
         L 265 198
         Q 210 210 155 198 Z"
      fill="#111"
      opacity="0.95"
    />

    {/* Wheels front-facing */}
    <WheelFace cx={130} cy={245} />
    <WheelFace cx={290} cy={245} />
  </Svg>
);

/* -----------------------------
   BACK VIEW (realistic + rear wheels)
------------------------------ */
export const CarBackView = () => (
  <Svg width={width - 40} height={280} viewBox="0 0 420 280">
    <Defs>
      <LinearGradient id="rearBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#4FC3F7" stopOpacity="1" />
        <Stop offset="100%" stopColor="#1565C0" stopOpacity="1" />
      </LinearGradient>

      <LinearGradient id="rearGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#E1F5FE" stopOpacity="0.75" />
        <Stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.25" />
      </LinearGradient>
    </Defs>

    <Ellipse cx="210" cy="255" rx="160" ry="12" fill="#000" opacity="0.14" />

    <Path
      d="M 75 150
         Q 82 100 125 75
         Q 170 50 210 50
         Q 250 50 295 75
         Q 338 100 345 150
         Q 350 205 310 225
         Q 260 245 210 245
         Q 160 245 110 225
         Q 70 205 75 150 Z"
      fill="url(#rearBody)"
      stroke="#0D47A1"
      strokeWidth="2.5"
    />

    {/* Rear window */}
    <Path
      d="M 140 92
         Q 170 65 210 63
         Q 250 65 280 92
         Q 250 110 210 112
         Q 170 110 140 92 Z"
      fill="url(#rearGlass)"
      stroke="#0277BD"
      strokeWidth="1.5"
      opacity="0.85"
    />

    {/* Tail lights */}
    <Path
      d="M 95 155
         Q 120 135 155 140
         Q 140 165 110 170
         Q 98 168 95 155 Z"
      fill="#FF3B3B"
      stroke="#B00020"
      strokeWidth="2"
      opacity="0.95"
    />
    <Path
      d="M 325 155
         Q 322 168 310 170
         Q 280 165 265 140
         Q 300 135 325 155 Z"
      fill="#FF3B3B"
      stroke="#B00020"
      strokeWidth="2"
      opacity="0.95"
    />

    {/* Plate */}
    <Rect x="165" y="175" width="90" height="20" rx="3" fill="#FFF" stroke="#333" strokeWidth="1.5" />
    <SvgText x="210" y="189" fontSize="10" fontWeight="700" fill="#000" textAnchor="middle">
      ARTEMIS
    </SvgText>

    {/* Diffuser */}
    <Path
      d="M 110 210
         Q 210 240 310 210
         L 315 232
         Q 210 260 105 232 Z"
      fill="#111"
      opacity="0.95"
    />

    {/* Wheels back-facing */}
    <WheelFace cx={130} cy={245} />
    <WheelFace cx={290} cy={245} />
  </Svg>
);