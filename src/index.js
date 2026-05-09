module.exports = function check(str, bracketsConfig) {
  const stack = [];
  const bracketTypes = bracketsConfig
    .map((config) =>
      config[0] === config[1]
        ? [
            {
              bracket: `${config[0]}`,
              type: 'duplicitous',
              hasBeenOpened: false,
            },
          ]
        : [
            { bracket: `${config[0]}`, type: 'opening' },
            { bracket: `${config[1]}`, type: 'closing' },
          ]
    )
    .flat();

  const getStackLastItem = () => {
    return stack.slice(-1)[0];
  };

  const getBracketType = (br) => {
    return [...bracketTypes.filter((x) => x.bracket === br)][0].type;
  };

  const isPair = (opening, closing) => {
    return bracketsConfig.some((x) => x[0] === opening && x[1] === closing);
  };

  const wasDuplicitousOpened = (br) => {
    if (getBracketType(br) !== 'duplicitous') return undefined;
    return [...bracketTypes.filter((x) => x.bracket === br)][0].hasBeenOpened;
  };

  const changeDuplicitousOpened = (br) => {
    if (getBracketType(br) === 'duplicitous') {
      const bracketMatch = [...bracketTypes.filter((x) => x.bracket === br)][0];
      bracketMatch.hasBeenOpened = !bracketMatch.hasBeenOpened;
    }
  };

  for (let i = 0; i < str.length; i += 1) {
    const currentBracket = str[i];
    let currentBracketType = getBracketType(currentBracket);

    if (currentBracketType === 'duplicitous') {
      currentBracketType = wasDuplicitousOpened(currentBracket)
        ? 'closing' // when previous was opening (returned true), mark this one as closing
        : 'opening'; // when previous was closing (returned true), mark this one as opening
      changeDuplicitousOpened(currentBracket); // refresh according to the last bracket
    }

    if (currentBracketType === 'opening') {
      // opening
      stack.push(currentBracket);
    } else if (stack.length > 0 && isPair(getStackLastItem(), currentBracket)) {
      // closing
      stack.pop();
    } else {
      // closing with no opening before
      return false;
    }
  }
  return stack.length === 0;
};
