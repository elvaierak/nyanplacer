import regexgen from 'regexgen'

const isFunction = functionToCheck => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

const makePlainPart = (str, index, length) => (
  {
    str, index, length,
    replace: false
  }
)

const makeReplacePart = (str, index, length) => (
  {
    str, index, length,
    replace: true
  }
)

const getMatches = (regex, str) => {
  const matches = []

  let previousIndex = 0
  let m

  do {
    m = regex.exec(str)

    if (m) {
      matches.push(makePlainPart(str, previousIndex, m.index - previousIndex))
      matches.push(makeReplacePart(str, m.index, m[0].length))

      previousIndex = m.index + m[0].length
    }
  } while (m)

  matches.push(makePlainPart(str, previousIndex, str.length - previousIndex))

  return matches
}

const compileMatches = (replacementObject, matches) => {
  return matches.map(match => {
    if (match.replace) {
      const word = match.str.substr(match.index, match.length)
      const func = replacementObject[word]

      if (!isFunction(func) || func.length === 0) {
        throw new Error(`Replacer of a word '${word}' is not correct`)
      }

      return func(word)
    }
    return match.str.substr(match.index, match.length)
  })
}

export default (replacementObject, str) => {
  const regex = regexgen(Object.keys(replacementObject), ['g'])
  const matches = getMatches(regex, str)

  return compileMatches(replacementObject, matches).join('')
}
