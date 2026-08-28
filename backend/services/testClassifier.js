
const classifyFailure = require("./classifyFailure");
const testPayment = {
  error_reason: "some_new_reason"
};
const category = classifyFailure(testPayment);

console.log("Failure reason:", testPayment.error_reason);
console.log("Category:", category);