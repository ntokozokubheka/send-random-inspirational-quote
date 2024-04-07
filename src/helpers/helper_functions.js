const {
  errorMessages,
  messageBody,
  mailDetails,
  constantStrings,
  regexObjects,
} = require("./helper_objects.js");

const path = require("path");

const axios = require("axios");

const fs = require("fs").promises;

const validator = require("validator");

const isSameQuote = () => {
  const args = process.argv[3];
  if (args) {
    if (args === constantStrings.same) {
      return true;
    }
    throw new Error(errorMessages.invalidFourthCommand(args));
  }
  return false;
};

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error(errorMessages.invalidEmail(email));
  }
  return [{ email: email, name: constantStrings.none }];
};

const validateJsonDataStructure = (jsonData) => {
  if (!jsonData) {
    throw new Error(errorMessages.emptyJsonFile);
  }

  if (!Array.isArray(jsonData)) {
    throw new Error(errorMessages.invalidJsonFormat);
  }

  jsonData.forEach((obj, index) => {
    const keys = Object.keys(obj);
    if (keys.length !== 2) {
      throw new Error(errorMessages.invalidObjectFieldNumKeys(index));
    } else if (!keys.includes("email") || !validator.isEmail(obj.email)) {
      throw new Error(errorMessages.invalidObjectFieldEmail(index, obj.email));
    } else if (
      !keys.includes("name") ||
      !regexObjects.namePattern.test(obj.name)
    ) {
      throw new Error(errorMessages.invalidObjectFieldName(index, obj.name));
    }
  });
};

const validateJsonFile = async (filePath) => {
  try {
    const jsonData = await fs.readFile(filePath, "utf-8");

    const parsedData = JSON.parse(jsonData);

    validateJsonDataStructure(parsedData);

    return parsedData;
  } catch (error) {
    throw new Error(error.message);
  }
};

const isFilePathValid = async (filePath) => {
  try {
    const normalizedFilePath = path.join(
      __dirname,
      "../..",
      path.basename(filePath)
    );

    await fs.access(normalizedFilePath);
    return normalizedFilePath;
  } catch {
    throw new Error(errorMessages.invalidFilePath);
  }
};

const fetchRandomQuotes = async (numQuotes) => {
  try {
    const url = constantStrings.quoteLink(isSameQuote() ? 1 : numQuotes);

    const response = await axios.get(url);

    return response.data.map((quote) => ({
      author: quote.author,
      message: quote.content,
    }));
  } catch (error) {
    if (error.message.includes(constantStrings.gridError)) {
      throw new Error(errorMessages.errorNetwork);
    } else {
      throw new Error(errorMessages.errorFetchingQuote(error.message));
    }
  }
};

const handleFilePathArgument = async (args) => {
  const filePath = await isFilePathValid(args);

  if (!filePath.endsWith(".json")) {
    throw new Error(errorMessages.invalidFileType);
  }

  const emailList = await validateJsonFile(filePath);

  return emailList;
};

const validateCommandLineArgs = async () => {
  const args = process.argv[2];

  if (!args) {
    throw new Error(errorMessages.blank);
  }

  if (args.includes("@")) {
    return validateEmail(args);
  } else {
    return handleFilePathArgument(args);
  }
};

const mailOptions = (
  receiverEmail,
  receiverName = constantStrings.none,
  quote
) => {
  return {
    from: mailDetails.from,
    to: receiverEmail,
    subject: mailDetails.subject,
    text: messageBody.text(quote, receiverName),
  };
};

module.exports = {
  validateCommandLineArgs,
  mailOptions,
  fetchRandomQuotes,
  isSameQuote,
};