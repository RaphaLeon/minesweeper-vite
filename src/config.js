export const config = {
  showHelp: false,
  MINE: -1,
  colorValues: {
    '1': '#0066ff',
    '2': '#009933',
    '3': '#ff3300',
    '4': '#002699',
    '5': '#cc3300',
    '6': '#ff6699',
    '7': '#ffff00'
  },
  highlighColorValues: { mine: '#ffd6cc', safe: '#e6ffe6' },
  levels: [
    { name: 'Beginner', rows: 7, cols: 7, mines: 10 },
    { name: 'Intermediate', rows: 15, cols: 15, mines: 40 },
    { name: 'Expert', rows: 15, cols: 29, mines: 99 }
  ],
  messages: {
    WIN: { content: 'Fuck yeah! You win this time :)', class: 'alert alert-info' },
    LOSE: { content: 'BOOM! You lose -__-', class: 'alert alert-danger' }
  }
}