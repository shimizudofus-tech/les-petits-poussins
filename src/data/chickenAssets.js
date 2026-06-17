import oeufSvg from '../assets/images/animaux/oeuf.svg'
// poussin/poule "*.svg" files are actually PNG bytes (broken when served as SVG);
// the real .png assets exist alongside them, so import those.
import poussinImg from '../assets/images/animaux/poussin.png'
import pouleImg from '../assets/images/animaux/poule.png'

export const CHICKEN_STAGE_ICONS = {
  egg: oeufSvg,
  baby: poussinImg,
  adult: pouleImg,
}
