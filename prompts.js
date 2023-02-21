export const getStylePrompt = (style) => {
  if (style === "Classic") {
    return "";
  } else if (style === "In the future") {
    return ", with this constraints: We live in the future, and we need to generate text and sections correspondingly (invent events, places, people, etc.). Go more in the future when generating more text";
  } else if (style === "Fake") {
    return ", with this constraints: We need to generate completely fake text and sections, things that does not exist in the real world:";
  }
};

export const promptSections = (pageName, style) => {
  return `Can you return the 3 sections related to this subject: '${pageName}'
  ${getStylePrompt(
    style
  )}.In a json format like this, in the order of appearance in the page: [\{{"header": "Event A ", "description": "This event happens/describe ..."}}, ...]`;
};

export const promptContinue = (pageName, currentSection, style) => {
  return `This is the section named "${
    currentSection.header
  }" for the page ${pageName}:\n${
    currentSection.description
  }.\n.Continue the section with 1 more paragraph ${getStylePrompt(style)}:\n`;
};
