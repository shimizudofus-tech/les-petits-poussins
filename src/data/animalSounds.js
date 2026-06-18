const SOUNDS_BY_ANIMAL = {
  chicken: { egg: '…', baby: 'Piou piou !', adult: 'Cot cot !' },
  pig: { egg: '…', baby: 'Groin !', adult: 'Groin groin !' },
  cow: { egg: '…', baby: 'Meuh ?', adult: 'Meuh !' },
  sheep: { egg: '…', baby: 'Bêê !', adult: 'Bêêê !' },
  rabbit: { egg: '…', baby: 'Hop hop !', adult: 'Hop !' },
  duck: { egg: '…', baby: 'Coin coin !', adult: 'Coin coin !' },
  horse: { egg: '…', baby: 'Hiii ?', adult: 'Hiii hiii !' },
  goat: { egg: '…', baby: 'Mêê ?', adult: 'Mêêê !' },
  dog: { egg: '…', baby: 'Wouf ?', adult: 'Wouf wouf !' },
  cat: { egg: '…', baby: 'Miaou ?', adult: 'Miaou !' },
  turkey: { egg: '…', baby: 'Glou ?', adult: 'Glou glou !' },
  mouse: { egg: '…', baby: 'Couic ?', adult: 'Couic couic !' },
}

export function getAnimalSound(animalKey, stage) {
  return SOUNDS_BY_ANIMAL[animalKey]?.[stage] ?? '…'
}
