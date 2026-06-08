export function checkEvolution(animalKey, collection) {
  const animal = collection[animalKey]
  const stageInfo = animal.stages[animal.currentStage]
  if (!stageInfo?.nextAge || animal.age < stageInfo.nextAge) {
    return { collection, event: null }
  }

  const updatedAnimal = { ...animal }

  if (animal.currentStage === 'egg') {
    updatedAnimal.currentStage = 'baby'
    return {
      collection: { ...collection, [animalKey]: updatedAnimal },
      event: { type: 'hatch', name: animal.name },
    }
  }

  if (animal.currentStage === 'baby') {
    updatedAnimal.currentStage = 'adult'
    updatedAnimal.completed = true
    return {
      collection: { ...collection, [animalKey]: updatedAnimal },
      event: { type: 'adult', name: animal.name },
    }
  }

  return { collection, event: null }
}
