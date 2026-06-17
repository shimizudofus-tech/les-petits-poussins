/* Art SVG mignon pour chaque type de décor / bâtiment.
   viewBox 120x120, objet posé sur le sol (y≈112). Jamais d'emoji → pas de
   "boîte vide" selon la police. Réutilisé par le monde ET le catalogue. */

const Shadow = () => <ellipse cx="60" cy="112" rx="34" ry="7" fill="#000" opacity="0.1" />

function Terrain() {
  return (<g><Shadow />
    <path d="M60,42 L106,72 L60,102 L14,72 Z" fill="#8FD14F" stroke="#5BA032" strokeWidth="3" strokeLinejoin="round" />
    <path d="M60,52 L92,72 L60,92 L28,72 Z" fill="#7CC242" />
    <g fill="#F4A024" stroke="#C77F12" strokeWidth="2" strokeLinejoin="round">
      <path d="M60,12 L52,27 L68,27 Z" />
      <path d="M60,104 L52,89 L68,89 Z" />
      <path d="M10,72 L25,64 L25,80 Z" />
      <path d="M110,72 L95,64 L95,80 Z" />
    </g></g>)
}
function House() {
  return (<g><ellipse cx="60" cy="112" rx="44" ry="8" fill="#000" opacity="0.1" />
    <rect x="26" y="56" width="68" height="54" rx="6" fill="#FFE2B0" stroke="#C98A3C" strokeWidth="3" />
    <path d="M18,58 L60,20 L102,58 Z" fill="#E76F51" stroke="#B8472E" strokeWidth="3" strokeLinejoin="round" />
    <rect x="50" y="80" width="20" height="30" rx="3" fill="#9C5B2E" stroke="#7A4521" strokeWidth="2" />
    <rect x="32" y="66" width="14" height="14" rx="2" fill="#BEE3F0" stroke="#7FB3C7" strokeWidth="2" />
    <rect x="74" y="66" width="14" height="14" rx="2" fill="#BEE3F0" stroke="#7FB3C7" strokeWidth="2" /></g>)
}
function Tree() {
  return (<g><Shadow /><rect x="52" y="64" width="16" height="48" rx="6" fill="#9C5B2E" stroke="#7A4521" strokeWidth="2.5" />
    <circle cx="60" cy="46" r="30" fill="#7CC242" /><circle cx="38" cy="56" r="20" fill="#8FD14F" />
    <circle cx="82" cy="56" r="20" fill="#6FB539" /><circle cx="60" cy="34" r="22" fill="#8FD14F" />
    <circle cx="50" cy="40" r="4.5" fill="#FF6B8A" /><circle cx="72" cy="50" r="4.5" fill="#FFD23B" /></g>)
}
function Pine() {
  return (<g><Shadow /><rect x="54" y="92" width="12" height="20" rx="3" fill="#9C5B2E" />
    <path d="M60,12 L86,56 L34,56 Z" fill="#4F9E45" /><path d="M60,36 L92,86 L28,86 Z" fill="#5BB14E" />
    <path d="M60,60 L96,98 L24,98 Z" fill="#67C257" /></g>)
}
function Bush() {
  return (<g><Shadow /><circle cx="44" cy="84" r="22" fill="#6FB539" /><circle cx="76" cy="84" r="22" fill="#7CC242" />
    <circle cx="60" cy="70" r="22" fill="#8FD14F" /><circle cx="52" cy="74" r="4" fill="#FF6B8A" /><circle cx="72" cy="82" r="4" fill="#FFD23B" /></g>)
}
function Flower() {
  const petal = (cx, cy, fill) => (<g key={cx + ',' + cy}>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={cx} cy={cy - 9} rx="4" ry="7" fill={fill} transform={`rotate(${a} ${cx} ${cy})`} />)}
    <circle cx={cx} cy={cy} r="4" fill="#FFD23B" /></g>)
  return (<g><Shadow /><rect x="34" y="78" width="3" height="30" fill="#5BA032" /><rect x="58" y="70" width="3" height="38" fill="#5BA032" /><rect x="82" y="80" width="3" height="28" fill="#5BA032" />
    {petal(35, 76, '#FF6B8A')}{petal(59, 66, '#B388FF')}{petal(83, 78, '#FF8A5B')}</g>)
}
function Fence() {
  return (<g><Shadow />{[28, 50, 72, 94].map((x) => <rect key={x} x={x} y="62" width="9" height="44" rx="3" fill="#C98A3C" stroke="#9C6B2E" strokeWidth="2" />)}
    <rect x="22" y="72" width="80" height="7" rx="3" fill="#D99A4C" stroke="#9C6B2E" strokeWidth="2" />
    <rect x="22" y="88" width="80" height="7" rx="3" fill="#D99A4C" stroke="#9C6B2E" strokeWidth="2" /></g>)
}
function Lamp() {
  return (<g><Shadow /><rect x="55" y="44" width="10" height="66" rx="4" fill="#5d6d7e" />
    <rect x="44" y="30" width="32" height="20" rx="6" fill="#FFD23B" stroke="#C9A227" strokeWidth="2.5" />
    <circle cx="60" cy="40" r="6" fill="#FFF3B0" /></g>)
}
function Pond() {
  return (<g><ellipse cx="60" cy="92" rx="50" ry="20" fill="#5EC5E8" stroke="#3FA7CC" strokeWidth="4" />
    <ellipse cx="60" cy="88" rx="40" ry="13" fill="#7FD6F0" /><ellipse cx="48" cy="92" rx="10" ry="5" fill="#5BA032" />
    <circle cx="48" cy="90" r="3" fill="#FF6B8A" /></g>)
}
function Haystack() {
  return (<g><Shadow /><path d="M18,108 Q60,40 102,108 Z" fill="#F4C95D" stroke="#D9A93C" strokeWidth="3" strokeLinejoin="round" />
    <path d="M34,108 Q60,64 86,108" fill="none" stroke="#D9A93C" strokeWidth="2.5" /><path d="M48,108 Q60,78 72,108" fill="none" stroke="#D9A93C" strokeWidth="2.5" /></g>)
}
function Rock() {
  return (<g><Shadow /><path d="M24,104 Q18,72 44,68 Q56,52 78,64 Q104,66 98,104 Z" fill="#A9B4BC" stroke="#7E8B93" strokeWidth="3" strokeLinejoin="round" />
    <path d="M44,70 q14,8 30,2" fill="none" stroke="#7E8B93" strokeWidth="2" opacity="0.6" /></g>)
}
function Mushroom() {
  return (<g><Shadow /><rect x="42" y="78" width="14" height="30" rx="6" fill="#F5EFE0" stroke="#D9CBAF" strokeWidth="2" />
    <rect x="66" y="86" width="11" height="22" rx="5" fill="#F5EFE0" stroke="#D9CBAF" strokeWidth="2" />
    <path d="M28,80 Q49,52 70,80 Z" fill="#E5524A" stroke="#B83A33" strokeWidth="2.5" /><circle cx="42" cy="70" r="3" fill="#fff" /><circle cx="56" cy="74" r="2.5" fill="#fff" />
    <path d="M60,90 Q71,74 84,90 Z" fill="#E5524A" stroke="#B83A33" strokeWidth="2" /></g>)
}
function Crops() {
  return (<g><Shadow />{[34, 52, 70, 88].map((x, i) => (<g key={x}><rect x={x - 2} y="64" width="4" height="44" fill="#5BA032" />
    <ellipse cx={x} cy="60" rx="7" ry="14" fill={i % 2 ? '#FFD23B' : '#F4C95D'} stroke="#D9A93C" strokeWidth="2" /></g>))}</g>)
}
function Cart() {
  return (<g><Shadow /><path d="M28,58 L92,58 L84,86 L36,86 Z" fill="#C98A3C" stroke="#9C6B2E" strokeWidth="3" strokeLinejoin="round" />
    <rect x="40" y="48" width="40" height="14" rx="3" fill="#E0A85A" /><circle cx="44" cy="96" r="11" fill="#7A4521" stroke="#5A3318" strokeWidth="3" /><circle cx="80" cy="96" r="11" fill="#7A4521" stroke="#5A3318" strokeWidth="3" /></g>)
}
function Barn() {
  return (<g><ellipse cx="60" cy="112" rx="42" ry="8" fill="#000" opacity="0.1" />
    <rect x="26" y="58" width="68" height="52" rx="5" fill="#D7503F" stroke="#A83A2D" strokeWidth="3" />
    <path d="M20,60 Q60,28 100,60 Z" fill="#B8472E" stroke="#8F3322" strokeWidth="3" />
    <rect x="50" y="76" width="20" height="34" fill="#F4E3C0" stroke="#C9A36A" strokeWidth="2" />
    <path d="M30,72 h64 M60,58 v52" stroke="#F4E3C0" strokeWidth="3" /></g>)
}
function Henhouse() {
  return (<g><Shadow /><rect x="34" y="64" width="52" height="46" rx="5" fill="#F4D29C" stroke="#C9A36A" strokeWidth="3" />
    <path d="M28,66 L60,40 L92,66 Z" fill="#B8472E" stroke="#8F3322" strokeWidth="3" />
    <circle cx="60" cy="86" r="11" fill="#7A4521" /><circle cx="60" cy="86" r="5" fill="#3A2412" /><rect x="48" y="106" width="24" height="6" fill="#C9A36A" /></g>)
}
function Stable() {
  return (<g><Shadow /><rect x="30" y="62" width="60" height="48" rx="5" fill="#A9714B" stroke="#7A4521" strokeWidth="3" />
    <path d="M24,64 L60,38 L96,64 Z" fill="#C98A3C" stroke="#9C6B2E" strokeWidth="3" />
    <path d="M44,110 V74 a16,16 0 0 1 32,0 V110 Z" fill="#5A3318" /><circle cx="78" cy="52" r="5" fill="#FFD23B" /></g>)
}
function Silo() {
  return (<g><Shadow /><rect x="42" y="40" width="36" height="70" rx="16" fill="#C7CDD2" stroke="#9AA3AB" strokeWidth="3" />
    <path d="M42,46 Q60,24 78,46 Z" fill="#9AA3AB" /><path d="M42,60 h36 M42,76 h36 M42,92 h36" stroke="#9AA3AB" strokeWidth="2" opacity="0.7" /></g>)
}
function Mill() {
  return (<g><ellipse cx="60" cy="112" rx="34" ry="7" fill="#000" opacity="0.1" />
    <path d="M46,110 L52,52 L68,52 L74,110 Z" fill="#EFE4D0" stroke="#C9B894" strokeWidth="3" />
    <g style={{ transformOrigin: '60px 48px' }} className="fw-windmill-blades">
      <path d="M60,48 L60,16 L70,20 Z" fill="#E76F51" stroke="#B8472E" strokeWidth="1.5" />
      <path d="M60,48 L92,48 L88,58 Z" fill="#E76F51" stroke="#B8472E" strokeWidth="1.5" />
      <path d="M60,48 L60,80 L50,76 Z" fill="#E76F51" stroke="#B8472E" strokeWidth="1.5" />
      <path d="M60,48 L28,48 L32,38 Z" fill="#E76F51" stroke="#B8472E" strokeWidth="1.5" /></g>
    <circle cx="60" cy="48" r="5" fill="#FFD23B" stroke="#C98A3C" strokeWidth="1.5" /></g>)
}
function Well() {
  return (<g><Shadow /><ellipse cx="60" cy="96" rx="28" ry="10" fill="#8B98A0" /><path d="M34,96 V72 h52 V96" fill="#A9B4BC" stroke="#7E8B93" strokeWidth="3" />
    <rect x="40" y="44" width="6" height="30" fill="#9C5B2E" /><rect x="74" y="44" width="6" height="30" fill="#9C5B2E" />
    <path d="M34,44 L60,30 L86,44 Z" fill="#B8472E" stroke="#8F3322" strokeWidth="2.5" /></g>)
}
function Greenhouse() {
  return (<g><Shadow /><path d="M28,108 V58 L60,36 L92,58 V108 Z" fill="#CFEFF6" stroke="#7FB3C7" strokeWidth="3" strokeLinejoin="round" opacity="0.92" />
    <path d="M60,36 V108 M28,72 h64 M28,90 h64" stroke="#7FB3C7" strokeWidth="2" /><circle cx="44" cy="96" r="5" fill="#67C257" /><circle cx="76" cy="96" r="5" fill="#FF6B8A" /></g>)
}
function Bakery() {
  return (<g><Shadow /><rect x="30" y="60" width="60" height="50" rx="5" fill="#F4D29C" stroke="#C9A36A" strokeWidth="3" />
    <rect x="26" y="52" width="68" height="14" rx="5" fill="#D7503F" /><path d="M30,60 h60" stroke="#fff" strokeWidth="0" />
    <path d="M40,52 v14 M52,52 v14 M64,52 v14 M76,52 v14" stroke="#F4E3C0" strokeWidth="3" />
    <ellipse cx="60" cy="88" rx="16" ry="11" fill="#E0A85A" stroke="#B8843C" strokeWidth="2" /><path d="M50,88 h20" stroke="#B8843C" strokeWidth="2" /></g>)
}
function Dairy() {
  return (<g><Shadow /><rect x="32" y="58" width="56" height="52" rx="5" fill="#F4F7F9" stroke="#B6C1C9" strokeWidth="3" />
    <path d="M26,60 L60,36 L94,60 Z" fill="#5EC5E8" stroke="#3FA7CC" strokeWidth="3" />
    <rect x="50" y="78" width="20" height="32" rx="2" fill="#BEE3F0" stroke="#7FB3C7" strokeWidth="2" /><circle cx="60" cy="50" r="6" fill="#fff" stroke="#B6C1C9" strokeWidth="2" /></g>)
}
function Beehouse() {
  return (<g><Shadow /><ellipse cx="60" cy="100" rx="30" ry="10" fill="#D9A93C" />
    {[88, 76, 64, 52].map((y, i) => <ellipse key={y} cx="60" cy={y} rx={26 - i * 4} ry="9" fill="#F4C95D" stroke="#D9A93C" strokeWidth="2" />)}
    <circle cx="60" cy="84" r="4" fill="#5A3318" /><circle cx="84" cy="58" r="4" fill="#FFD23B" stroke="#3A2412" strokeWidth="1.5" /></g>)
}
function Market() {
  return (<g><Shadow /><rect x="30" y="64" width="60" height="46" rx="4" fill="#F4E3C0" stroke="#C9A36A" strokeWidth="3" />
    <path d="M24,64 h72 l-6,-16 h-60 Z" fill="#fff" /><path d="M30,48 h12 v16 h-12 Z M54,48 h12 v16 h-12 Z M78,48 h12 v16 h-12 Z" fill="#E5524A" />
    <rect x="50" y="84" width="20" height="26" fill="#9C5B2E" /></g>)
}
function Lighthouse() {
  return (<g><Shadow /><path d="M46,108 L50,44 L70,44 L74,108 Z" fill="#F4F7F9" stroke="#B6C1C9" strokeWidth="3" />
    <path d="M50,60 L70,60 M48,80 L72,80" stroke="#D7503F" strokeWidth="6" /><rect x="48" y="30" width="24" height="16" rx="3" fill="#FFD23B" stroke="#C9A227" strokeWidth="2" />
    <path d="M60,26 L60,16" stroke="#7E8B93" strokeWidth="3" /><circle cx="60" cy="38" r="4" fill="#FFF3B0" /></g>)
}
function Windpump() {
  return (<g><Shadow /><path d="M52,108 L56,52 L64,52 L68,108 Z" fill="#9AA3AB" stroke="#7E8B93" strokeWidth="2.5" />
    <path d="M52,108 L68,108 M50,90 L70,90 M52,72 L68,72" stroke="#7E8B93" strokeWidth="2" />
    <g style={{ transformOrigin: '60px 48px' }} className="fw-windmill-blades">
      {[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d="M60,48 L60,22 L65,26 Z" fill="#C7CDD2" stroke="#9AA3AB" strokeWidth="1" transform={`rotate(${a} 60 48)`} />)}</g>
    <circle cx="60" cy="48" r="4" fill="#7E8B93" /></g>)
}
function Fountain() {
  return (<g><Shadow /><ellipse cx="60" cy="98" rx="34" ry="11" fill="#5EC5E8" stroke="#3FA7CC" strokeWidth="3" />
    <rect x="56" y="60" width="8" height="34" fill="#B6C1C9" /><ellipse cx="60" cy="62" rx="16" ry="6" fill="#7FD6F0" stroke="#3FA7CC" strokeWidth="2" />
    <path d="M60,56 Q52,42 48,54 M60,56 Q68,42 72,54" fill="none" stroke="#7FD6F0" strokeWidth="3" strokeLinecap="round" /><circle cx="60" cy="50" r="4" fill="#7FD6F0" /></g>)
}
function Scarecrow() {
  return (<g><Shadow /><rect x="57" y="44" width="6" height="64" fill="#9C5B2E" /><rect x="34" y="58" width="52" height="6" fill="#9C5B2E" />
    <circle cx="60" cy="40" r="14" fill="#F4C95D" stroke="#D9A93C" strokeWidth="2.5" /><path d="M48,30 Q60,18 72,30 Z" fill="#D7503F" />
    <circle cx="55" cy="40" r="2.5" fill="#3A2412" /><circle cx="65" cy="40" r="2.5" fill="#3A2412" /><path d="M40,64 l-6,12 M80,64 l6,12" stroke="#D9A93C" strokeWidth="3" /></g>)
}
function Rainbow() {
  const arc = (r, c) => <path d={`M${60 - r},104 a${r},${r} 0 0 1 ${2 * r},0`} fill="none" stroke={c} strokeWidth="7" />
  return (<g>{arc(44, '#E5524A')}{arc(37, '#FF8A5B')}{arc(30, '#FFD23B')}{arc(23, '#67C257')}{arc(16, '#5EC5E8')}
    <circle cx="22" cy="100" r="8" fill="#fff" /><circle cx="98" cy="100" r="8" fill="#fff" /></g>)
}
function Balloon() {
  return (<g><path d="M60,72 V104" stroke="#9C6B2E" strokeWidth="2" /><path d="M44,64 Q44,96 60,72 Q76,96 76,64 Z" fill="#E5524A" opacity="0.9" />
    <ellipse cx="60" cy="46" rx="26" ry="30" fill="#E5524A" stroke="#B83A33" strokeWidth="2.5" /><path d="M60,16 V76" stroke="#B83A33" strokeWidth="1.5" opacity="0.5" />
    <ellipse cx="50" cy="36" rx="6" ry="9" fill="#fff" opacity="0.4" /><rect x="50" y="96" width="20" height="14" rx="3" fill="#9C5B2E" /></g>)
}
function Statue() {
  return (<g><Shadow /><rect x="42" y="92" width="36" height="18" rx="3" fill="#B6C1C9" stroke="#8B98A0" strokeWidth="2.5" />
    <circle cx="60" cy="46" r="13" fill="#CFD7DC" stroke="#9AA3AB" strokeWidth="2.5" /><path d="M48,92 V64 a12,12 0 0 1 24,0 V92 Z" fill="#CFD7DC" stroke="#9AA3AB" strokeWidth="2.5" /></g>)
}
function Bench() {
  return (<g><Shadow /><rect x="32" y="74" width="56" height="8" rx="3" fill="#C98A3C" stroke="#9C6B2E" strokeWidth="2" />
    <rect x="32" y="58" width="56" height="8" rx="3" fill="#D99A4C" stroke="#9C6B2E" strokeWidth="2" />
    <rect x="36" y="82" width="6" height="24" fill="#9C6B2E" /><rect x="78" y="82" width="6" height="24" fill="#9C6B2E" /></g>)
}
function Signpost() {
  return (<g><Shadow /><rect x="56" y="50" width="8" height="58" fill="#9C5B2E" />
    <path d="M30,54 h44 l10,10 -10,10 h-44 Z" fill="#D99A4C" stroke="#9C6B2E" strokeWidth="2.5" strokeLinejoin="round" /><path d="M40,64 h28" stroke="#7A4521" strokeWidth="3" /></g>)
}
function Flag() {
  return (<g><Shadow /><rect x="54" y="30" width="5" height="78" fill="#9AA3AB" /><path d="M59,32 L92,44 L59,56 Z" fill="#E5524A" stroke="#B83A33" strokeWidth="2" strokeLinejoin="round" /></g>)
}
function Mailbox() {
  return (<g><Shadow /><rect x="56" y="64" width="7" height="44" fill="#9C5B2E" /><rect x="38" y="44" width="44" height="28" rx="10" fill="#5EC5E8" stroke="#3FA7CC" strokeWidth="3" />
    <rect x="38" y="58" width="44" height="14" fill="#4DB3D6" /><rect x="82" y="48" width="6" height="14" fill="#E5524A" /></g>)
}
function Barrel() {
  return (<g><Shadow /><path d="M40,58 Q60,52 80,58 L84,104 Q60,110 36,104 Z" fill="#C98A3C" stroke="#9C6B2E" strokeWidth="3" strokeLinejoin="round" />
    <path d="M38,72 Q60,68 82,72 M37,90 Q60,86 83,90" fill="none" stroke="#7A4521" strokeWidth="3" /><ellipse cx="60" cy="58" rx="20" ry="6" fill="#E0A85A" /></g>)
}
function Kite() {
  return (<g><path d="M60,76 Q52,92 58,108 Q62,96 60,76" fill="none" stroke="#9C6B2E" strokeWidth="1.5" />
    <path d="M60,24 L84,52 L60,80 L36,52 Z" fill="#5EC5E8" stroke="#3FA7CC" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M60,24 L60,80 M36,52 L84,52" stroke="#fff" strokeWidth="2" opacity="0.7" />
    <path d="M60,80 l-5,8 5,4 5,-4 Z" fill="#FFD23B" /></g>)
}
function Campfire() {
  return (<g><Shadow /><path d="M34,104 L86,90 M86,104 L34,90" stroke="#9C5B2E" strokeWidth="6" strokeLinecap="round" />
    <path d="M60,44 Q44,64 54,84 Q60,72 60,84 Q72,70 66,52 Q62,60 60,44 Z" fill="#FF8A5B" stroke="#E5524A" strokeWidth="2" />
    <path d="M60,60 Q53,72 58,84 Q66,76 60,60 Z" fill="#FFD23B" /></g>)
}

function Cloud() {
  return (<g><ellipse cx="40" cy="62" rx="26" ry="18" fill="#fff" /><ellipse cx="62" cy="50" rx="22" ry="18" fill="#fff" />
    <ellipse cx="82" cy="62" rx="24" ry="17" fill="#fff" /><ellipse cx="60" cy="68" rx="40" ry="14" fill="#fff" />
    <ellipse cx="50" cy="56" rx="16" ry="10" fill="#fff" opacity="0.7" /></g>)
}
function Bird() {
  const wing = (cx, cy, s) => <path d={`M${cx - 14 * s},${cy} Q${cx},${cy - 11 * s} ${cx},${cy} Q${cx},${cy - 11 * s} ${cx + 14 * s},${cy}`} fill="none" stroke="#5d6d7e" strokeWidth={3 * s} />
  return (<g>{wing(40, 46, 1)}{wing(78, 60, 0.8)}{wing(58, 38, 0.6)}</g>)
}

const ART = {
  terrain: Terrain,
  cloud: Cloud, bird: Bird,
  house: House, tree: Tree, pine: Pine, bush: Bush, flower: Flower, fence: Fence, lamp: Lamp,
  pond: Pond, haystack: Haystack, rock: Rock, mushroom: Mushroom, crops: Crops, cart: Cart,
  barn: Barn, henhouse: Henhouse, stable: Stable, silo: Silo, mill: Mill, well: Well,
  greenhouse: Greenhouse, bakery: Bakery, dairy: Dairy, beehouse: Beehouse, market: Market,
  lighthouse: Lighthouse, windpump: Windpump, fountain: Fountain, scarecrow: Scarecrow,
  rainbow: Rainbow, balloon: Balloon, statue: Statue, bench: Bench, signpost: Signpost,
  flag: Flag, mailbox: Mailbox, barrel: Barrel, kite: Kite, campfire: Campfire,
}

export function hasFarmArt(kind) {
  return Boolean(ART[kind])
}

export default function FarmArt({ kind, width = 90, className = '', style }) {
  const Comp = ART[kind]
  if (!Comp) return null
  return (
    <svg viewBox="0 0 120 120" width={width} className={className} style={style} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
      <Comp />
    </svg>
  )
}
