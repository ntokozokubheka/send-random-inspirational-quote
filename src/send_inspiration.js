const logger = require("./helpers/logger.js");

const {
  validateCommandLineArgs,
  mailOptions,
  fetchRandomQuotes,
  isSameQuote,
} = require("./helpers/helper_functions.js");

const { transporter, errorMessages } = require("./helpers/helper_objects.js");

const sendEmail = async () => {
  try {
    const results = [];

    const receiverDetails = await validateCommandLineArgs();

    const quotes = await fetchRandomQuotes(receiverDetails.length);

    for (let i = 0; i < receiverDetails.length; i++) {
      const { email, name } = receiverDetails[i];

      const quote = isSameQuote() ? quotes[0] : quotes[i];

      const options = mailOptions(email, name, quote);

      await transporter.sendMail(options);

      results.push(email);
    }

    return results;
  } catch (error) {
    throw new Error(errorMessages.failureToSend(error.message));
  }
};

const main = async () => {
  try {
    const result = await sendEmail();
    logger.info(`Email sent successfully to: ${result.join(", ")}`);
  } catch (error) {
    logger.error(error.message);
  }
};

if (require.main === module) {
  main();
}

module.exports = { sendEmail };