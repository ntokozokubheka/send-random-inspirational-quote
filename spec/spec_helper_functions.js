const fs = require("fs");

const handleLogFile = () => {
  const errorsLogPath = "errors.log";

  if (fs.existsSync(errorsLogPath)) {
    const content = fs.readFileSync(errorsLogPath, "utf-8");
    const containsNonSpace = content.trim().length > 0;
    if (!containsNonSpace) {
      fs.unlinkSync(errorsLogPath);
    }
  }
};

module.exports = { handleLogFile };