export const DEFAULT_AUDIO_SETTINGS = {
  musicEnabled: true,
  musicVolume: 0.25,
  voiceEnabled: true,
  voiceVolume: 1,
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function mergeAudioSettings(saved) {
  const defaults = DEFAULT_AUDIO_SETTINGS
  if (!saved || typeof saved !== 'object') {
    return { ...defaults }
  }

  return {
    musicEnabled: saved.musicEnabled ?? defaults.musicEnabled,
    musicVolume: clamp(Number(saved.musicVolume ?? defaults.musicVolume), 0, 1),
    voiceEnabled: saved.voiceEnabled ?? defaults.voiceEnabled,
    voiceVolume: clamp(Number(saved.voiceVolume ?? defaults.voiceVolume), 0, 1),
  }
}

let activeSettings = { ...DEFAULT_AUDIO_SETTINGS }

export function setActiveAudioSettings(settings) {
  activeSettings = mergeAudioSettings(settings)
  return activeSettings
}

export function getActiveAudioSettings() {
  return activeSettings
}
