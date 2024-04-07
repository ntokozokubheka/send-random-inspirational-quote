const { sendEmail } = require("../src/send_inspiration.js");
const Mailer = require("nodemailer/lib/mailer");
const fs = require("fs").promises;
const axios = require("axios");

const { handleLogFile } = require("./spec_helper_functions.js");

const {
  errorMessages,
  constantStrings,
  regexObjects,
} = require("../src/helpers/helper_objects.js");

const {
  mockData,
  mockJsonData,
  mockInvalidJsonData,
  mockDataResponseData,
  quote1,
  quote2,
  quote3,
} = require("./spec_helper_objects.js");

const { mailOptions } = require("../src/helpers/helper_functions.js");

describe("sendEmail", () => {
  let sendMailSpy,
    nodePath,
    scriptPath,
    emailAddress,
    fsAccessSpy,
    returnData,
    axiosSpy;

  beforeEach(() => {
    fsAccessSpy = spyOn(fs, "access").and.resolveTo();

    fsReadMock = spyOn(fs, "readFile").and.returnValue(
      Promise.resolve(mockJsonData)
    );

    axiosSpy = spyOn(axios, "get").and.returnValues(
      Promise.resolve({ data: mockDataResponseData })
    );

    nodePath = "/usr/local/bin/node";
    scriptPath = "src/send_inspiration.js";
    emailAddress = "someone@email.com";

    filePath = "~/email_recipients.json";

    process.argv = [nodePath, scriptPath];

    sendMailSpy = spyOn(Mailer.prototype, "sendMail").and.callFake(function (
      cb
    ) {
      if (cb && typeof cb === "function") {
        cb(null, true);
      }

      return mockData;
    });

    returnData = [
      "linearalgebra@gmail.com",
      "freemysoul007@gmail.com",
      "siphozulu@hotmail.com",
    ];
  });

  afterEach(() => {
    handleLogFile();
  });

  it("should successfully call axios get method with the correct arguments for an email address", async () => {
    process.argv.push(emailAddress);

    await sendEmail();

    expect(axiosSpy).toHaveBeenCalledOnceWith(constantStrings.quoteLink(1));
  });

  it("should successfully call axios get method with the correct arguments for a file path", async () => {
    process.argv.push(filePath);

    await sendEmail();

    expect(axiosSpy).toHaveBeenCalledOnceWith(constantStrings.quoteLink(3));
  });

  it("should successfully send an email with the correct arguments", async () => {
    process.argv.push(emailAddress);

    await sendEmail();

    expect(sendMailSpy).toHaveBeenCalledOnceWith(
      mailOptions(emailAddress, constantStrings.none, quote1)
    );
  });

  it("should send a quote in the correct format", async () => {
    process.argv.push(emailAddress);

    await sendEmail();

    expect(sendMailSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        text: jasmine.stringMatching(regexObjects.expectedFormatPattern),
      })
    );
  });

  it("should return a success message when the email is correctly sent", async () => {
    process.argv.push(emailAddress);

    const result = await sendEmail();

    expect(result).toEqual(["someone@email.com"]);
  });

  it("should throw an error when the email fails to send", async () => {
    const simulatedError = "Account not activated";

    process.argv.push(emailAddress);

    sendMailSpy.and.returnValue(Promise.reject(new Error(simulatedError)));

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(simulatedError)
    );
  });

  it("should throw an error for a blank email in the command line", async () => {
    process.argv.pop();

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.blank)
    );
  });

  it("should throw an error for an invalid email format in the command line", async () => {
    const invalidEmail = "bad@email";

    process.argv[2] = invalidEmail;

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.invalidEmail(invalidEmail))
    );
  });

  it("should successfully send the same quote to multiple accounts when specified as 'same'", async () => {
    process.argv = [nodePath, scriptPath, filePath, constantStrings.same];

    await sendEmail();

    const { text } = sendMailSpy.calls.argsFor(0)[0];
    const match = text.match(regexObjects.quoteAndAuthorRegex);
    const quote = { author: match[2], message: match[1] };

    expect(sendMailSpy.calls.argsFor(0)[0]).toEqual(
      mailOptions("linearalgebra@gmail.com", "Chris", quote)
    );

    expect(sendMailSpy.calls.argsFor(1)[0]).toEqual(
      mailOptions("freemysoul007@gmail.com", "Free", quote)
    );

    expect(sendMailSpy.calls.argsFor(2)[0]).toEqual(
      mailOptions("siphozulu@hotmail.com", "Sipho", quote)
    );
  });

  it("should successfully send email to multiple accounts when the email JSON file path is specified", async () => {
    process.argv.push(filePath);

    await sendEmail();

    expect(sendMailSpy.calls.argsFor(0)[0]).toEqual(
      mailOptions("linearalgebra@gmail.com", "Chris", quote1)
    );

    expect(sendMailSpy.calls.argsFor(1)[0]).toEqual(
      mailOptions("freemysoul007@gmail.com", "Free", quote2)
    );

    expect(sendMailSpy.calls.argsFor(2)[0]).toEqual(
      mailOptions("siphozulu@hotmail.com", "Sipho", quote3)
    );
  });

  it("should return multiple success messages when the emails are correctly sent", async () => {
    process.argv.push(filePath);

    const result = await sendEmail();

    expect(result).toEqual(returnData);
  });

  it("should throw an error for a file that has JSON doesn’t match the required format", async () => {
    process.argv.push(filePath);

    fsReadMock.and.returnValue(Promise.resolve(mockInvalidJsonData));

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.invalidObjectFieldNumKeys(0))
    );
  });

  it("should throw an error for a file that is not of type JSON in the command line", async () => {
    filePath = "dat%/email_recipients.txt";
    process.argv.push(filePath);

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.invalidFileType)
    );
  });

  it("should throw an error for an invalid file path in the command line", async () => {
    fsAccessSpy.and.callThrough();

    filePath = "/path/to/nonexistent/file.json";
    process.argv.push(filePath);

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.invalidFilePath)
    );
  });

  it("should throw an error for an empty json file", async () => {
    process.argv.push(filePath);

    fsReadMock.and.returnValue(Promise.resolve(null));

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(errorMessages.emptyJsonFile)
    );
  });

  it("should throw an error for an invalid fourth command line argument", async () => {
    invalidArg = "invalid";
    process.argv.push(filePath);
    process.argv.push(invalidArg);

    await expectAsync(sendEmail()).toBeRejectedWithError(
      errorMessages.failureToSend(
        errorMessages.errorFetchingQuote(
          errorMessages.invalidFourthCommand(invalidArg)
        )
      )
    );
  });
});