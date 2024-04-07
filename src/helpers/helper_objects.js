const { createTransport } = require("nodemailer");

const constantStrings = {
  none: "none",
  same: "--same",
  gridError: "getaddrinfo",
  quoteLink: (numQuotes) => {
    return `https://api.quotable.io/quotes/random?limit=${numQuotes}`;
  },
};

const regexObjects = {
  emailRegex: /^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  namePattern: /^[A-Z][a-z]{1,}(-[A-Z][a-z]{1,})?$/,
  quoteAndAuthorRegex: /"([^"]+)"\s*-\s*([^"]+)$/,
  expectedFormatPattern: /^".+" - .+$/,
};

const errorMessages = {
  errorNetwork: "Network issue: Unable to connect to the internet",

  invalidEmail: (email) => {
    return `Invalid email address : ${email}. Please provide a valid email.`;
  },
  blank: "No command line arguments provided.",

  invalidJsonFormat: "JSON data is not in the expected array format.",

  failureToSend: (err) => {
    return `Failed to send email. ${err}`;
  },

  invalidFilePath: "File Path doesn't exist.",

  invalidFileType: "File must have a .json extension.",

  invalidJsonFormat: "Data in the json file not in the valid format",

  emptyJsonFile: "Data in Json is empty",

  invalidCommandLineArg: (err) => {
    `Failed processing command line argument: ${err}.`;
  },

  invalidJsonFile: (err) => {
    `Error with the JSON file: ${err}`;
  },

  errorFetchingQuote: (err) => {
    return `Failed fetching quote: ${err}.`;
  },

  invalidFourthCommand: (arg) => {
    return `Invalid fourth command line argument ${arg}.`;
  },
  invalidObjectFieldNumKeys: (index) => {
    return `Object at index ${index} has invalid number of keys.`;
  },
  invalidObjectFieldName: (index, name) => {
    return `Object at index ${index}  invalid name field: ${name}`;
  },
  invalidObjectFieldEmail: (index, email) => {
    return `Object at index ${index}  invalid email field: ${email}`;
  },
};

const messageBody = {
  text: (quote, name) =>
    name === constantStrings.none
      ? `"${quote.message}" - ${quote.author}`
      : `Dear ${name},\n\n"${quote.message}" - ${quote.author}`,
};

const mailDetails = {
  from: process.env.SMTP_LOGIN,
  subject:
    "Ignite Your Day: Embrace the Power Within - A Motivational Quote Just for You",
};

const transporter = createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = {
  errorMessages,
  mailDetails,
  messageBody,
  regexObjects,
  transporter,
  constantStrings,
};