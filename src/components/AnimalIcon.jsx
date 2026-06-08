import { isImageIcon } from '../utils/animalIcon'

export default function AnimalIcon({ icon, alt = '', className = '' }) {
  if (isImageIcon(icon)) {
    return <img src={icon} alt={alt} className={className} draggable={false} />
  }

  return (
    <span className={className} aria-hidden={alt ? undefined : true}>
      {icon}
    </span>
  )
}
