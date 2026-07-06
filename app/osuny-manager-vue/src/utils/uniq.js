export function uniq (array) {
  return Array.from(
    array.reduce((set, e) => set.add(e), new Set())
  )
}