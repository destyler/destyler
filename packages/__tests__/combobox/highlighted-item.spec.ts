import { testHighlightedItems } from './highlighted-item.cases'

// Quoted and backslash values also need native selector coverage.
testHighlightedItems(['Dog', 'double"quote', 'back\\slash', 'square[brackets]'])
