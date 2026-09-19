import { algorithms, getAlgorithm } from './algorithms/index.js';
import { Visualizer }  from './core/Visualizer.js';
import { CodePanel }   from './core/CodePanel.js';
import { Player }      from './core/Player.js';
import { AudioEngine } from './core/AudioEngine.js';
import { generateData, CaseType } from './core/DataFactory.js';
import { Controls, SPEEDS } from './ui/Controls.js';

/* ---------- Estado ---------- */
const state = {
  algorithmId: algorithms[0].id,
  size: 40,
  caseType: CaseType.RANDOM,
  speed: SPEEDS[1],
};

/* ---------- Wiring ---------- */
const visualizer = new Visualizer(document.getElementById('bars'));
const codePanel  = new CodePanel(document.getElementById('code'));
const audio      = new AudioEngine();
const player     = new Player(visualizer, codePanel);

const controls = new Controls({
  algorithms,

  onAlgorithmChange(algo) { state.algorithmId = algo.id; regenerate(); },
  onSizeChange(size)      { state.size = size; regenerate(); },
  onCaseChange(c)         { state.caseType = c; regenerate(); },
  onSpeedChange(speed)    { state.speed = speed; player.setSpeed(speed.sps); },
  onPlayToggle()          { player.toggle(); },
  onStep()                { player.stepAndRender(); },
  onReset()               { player.reset(); player.pause(); },
  onNewData()             { regenerate(); },

  onSoundToggle() {
    const enabled = audio.toggle();
    controls.setSoundEnabled(enabled);
  },
});

/* ---------- Reacciones del Player ---------- */

player.onStateChange = ({ playing, finished, canStep }) => {
  controls.setPlaying(playing);
  controls.setStepEnabled(canStep);
  if (finished) controls.btnPlay.textContent = '↻ Repetir';
};

player.onCountersChange = (counters) => {
  controls.updateStats(counters);
};

// Cada vez que un índice NUEVO se marca como ordenado → un tono.
// El pitch depende del valor: barras altas suenan más agudo.
player.onSorted = (index, value, total) => {
  audio.play(value / total);
};

/* ---------- Audio: desbloqueo tras el primer gesto del usuario ---------- */
const unlockAudio = () => {
  audio.unlock();
  document.removeEventListener('click', unlockAudio);
  document.removeEventListener('keydown', unlockAudio);
};
document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio);

/* ---------- Flujo principal ---------- */
function regenerate() {
  const algo = getAlgorithm(state.algorithmId);
  const data = generateData(state.size, state.caseType, algo);
  player.setSpeed(state.speed.sps);
  player.load(algo, data);
}

/* ---------- Atajos ---------- */
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  if (e.code === 'Space')      { e.preventDefault(); player.toggle(); }
  if (e.code === 'ArrowRight') { e.preventDefault(); player.stepAndRender(); }
  if (e.code === 'KeyR')       { player.reset(); }
  if (e.code === 'KeyM')       { controls.setSoundEnabled(audio.toggle()); }
});

regenerate();
