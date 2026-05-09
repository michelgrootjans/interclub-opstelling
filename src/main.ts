import { findSingleCompositions } from './logic/compositions'

type Player = {
  name: string
  singles: number
  doubles: number
}

const PLAYERS_KEY = 'tennis-players'
const LIMIT_KEY = 'tennis-limit'
const DEFAULT_LIMIT = 140

function loadPlayers(): Player[] {
  const stored = localStorage.getItem(PLAYERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function savePlayers(players: Player[]): void {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

function loadLimit(): number {
  const stored = localStorage.getItem(LIMIT_KEY)
  return stored ? parseInt(stored) : DEFAULT_LIMIT
}

function saveLimit(limit: number): void {
  localStorage.setItem(LIMIT_KEY, String(limit))
}

let players: Player[] = loadPlayers()
let limit: number = loadLimit()

const app = document.getElementById('app')!

app.innerHTML = `
  <h1>Interclub Planning</h1>

  <section id="add-player">
    <h2>Speler toevoegen</h2>
    <form id="player-form">
      <input id="input-name"    type="text"   placeholder="Naam"            required />
      <input id="input-singles" type="number" placeholder="Singles ranking" required min="1" />
      <input id="input-doubles" type="number" placeholder="Doubles ranking" required min="1" />
      <button type="submit">Toevoegen</button>
    </form>
  </section>

  <section id="player-list">
    <h2>Spelers</h2>
    <ul id="players-ul"></ul>
  </section>

  <section id="compositions">
    <h2>Opstellingen</h2>
    <label>Limiet: <input id="input-limit" type="number" min="1" /></label>
    <div id="compositions-list"></div>
  </section>
`

const form = document.getElementById('player-form') as HTMLFormElement
const nameInput = document.getElementById('input-name') as HTMLInputElement
const singlesInput = document.getElementById('input-singles') as HTMLInputElement
const doublesInput = document.getElementById('input-doubles') as HTMLInputElement
const limitInput = document.getElementById('input-limit') as HTMLInputElement
const playersUl = document.getElementById('players-ul')!
const compositionsList = document.getElementById('compositions-list')!

limitInput.value = String(limit)

function renderPlayers(): void {
  playersUl.innerHTML = players
    .map((p, i) => `
      <li>
        ${p.name} (S:${p.singles} / D:${p.doubles})
        <button data-index="${i}">Verwijder</button>
      </li>
    `)
    .join('')
}

function renderCompositions(): void {
  const compositions = findSingleCompositions(players, limit)
  if (compositions.length === 0) {
    compositionsList.innerHTML = '<p>Geen geldige opstellingen.</p>'
    return
  }
  compositionsList.innerHTML = compositions
    .map(c => `
      <div class="composition">
        <strong>Totaal: ${c.total}</strong>
        <ul>${c.players.map(p => `<li>${p.name} (${p.singles})</li>`).join('')}</ul>
      </div>
    `)
    .join('')
}

function update(): void {
  renderPlayers()
  renderCompositions()
}

form.addEventListener('submit', e => {
  e.preventDefault()
  players = [...players, {
    name: nameInput.value.trim(),
    singles: parseInt(singlesInput.value),
    doubles: parseInt(doublesInput.value),
  }]
  savePlayers(players)
  form.reset()
  update()
})

playersUl.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest('button[data-index]')
  if (!btn) return
  const index = parseInt((btn as HTMLElement).dataset.index!)
  players = players.filter((_, i) => i !== index)
  savePlayers(players)
  update()
})

limitInput.addEventListener('input', () => {
  const val = parseInt(limitInput.value)
  if (!isNaN(val) && val > 0) {
    limit = val
    saveLimit(limit)
    renderCompositions()
  }
})

update()
