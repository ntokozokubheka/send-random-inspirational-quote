const mockJsonData = JSON.stringify([
  {
    email: "linearalgebra@gmail.com",
    name: "Chris",
  },

  {
    email: "freemysoul007@gmail.com",
    name: "Free",
  },

  {
    email: "siphozulu@hotmail.com",
    name: "Sipho",
  },
]);

const mockInvalidJsonData = JSON.stringify([
  {
    email: "linearalgebra@gmail.com",
    name: "Chris",
    age: 1,
  },

  {
    email: "freemysoul007@gmail.com",
    name: "Free",
  },
]);

const quote1 = { message: "Mocked quote content 1", author: "One" };

const quote2 = {
  message: "Mocked quote content 2",
  author: "Two",
};
const quote3 = {
  message: "Mocked quote content 3",
  author: "Three",
};

const mockDataResponseData = [
  {
    content: "Mocked quote content 1",
    author: "One",
  },
  {
    content: "Mocked quote content 2",
    author: "Two",
  },
  {
    content: "Mocked quote content 3",
    author: "Three",
  },
  {
    content: "Mocked quote content 2",
    author: "Two",
  },
];

const mockData = {
  accepted: ["someone@email.com"],
  rejected: [],
  ehlo: [
    "PIPELINING",
    "8BITMIME",
    "ENHANCEDSTATUSCODES",
    "CHUNKING",
    "STARTTLS",
    "AUTH PLAIN LOGIN CRAM-MD5",
    "SIZE 20971520",
  ],
  envelopeTime: 644,
  messageTime: 291,
  messageSize: 409,
  response:
    "250 2.0.0 OK: queued as <79f32519-88e5-d54c-b1cb-6923697ef4a2@umuzi.org>",
  envelope: {
    from: "ntokozo.kubheka@umuzi.org",
    to: ["someone@email.com"],
  },
  messageId: "<79f32519-88e5-d54c-b1cb-6923697ef4a2@umuzi.org>",
};

module.exports = {
  mockJsonData,
  mockInvalidJsonData,
  mockData,
  mockDataResponseData,
  quote1,
  quote2,
  quote3,
};