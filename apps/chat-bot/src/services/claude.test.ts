import { getTapeyResponse } from "./claude";

jest.mock("@anthropic-ai/sdk", () => {
  const createMock = jest.fn();

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: createMock,
      },
    })),
    __mockCreate__: createMock,
  };
});

const { __mockCreate__ } = jest.requireMock("@anthropic-ai/sdk");

describe("getTapeyResponse", () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns bot message when response type is 'text'", async () => {
    __mockCreate__.mockResolvedValue({
      content: [{ type: "text", text: "Hello, friend!" }],
    });

    const response = await getTapeyResponse("Hi there");
    expect(response).toEqual({ message: "Hello, friend!" });
    expect(__mockCreate__).toHaveBeenCalledWith({
      model: expect.any(String),
      max_tokens: expect.any(Number),
      system: expect.any(String),
      messages: [
        {
          role: "user",
          content: "Hi there",
        },
      ],
    });
  });

  it("returns fallback message if response type is not 'text'", async () => {
    __mockCreate__.mockResolvedValue({
      content: [{ type: "non-text", foo: "bar" }],
    });

    const response = await getTapeyResponse("Something weird");
    expect(response).toEqual({
      message: "Sorry dude, I'm having trouble processing that right now!",
    });
  });

  it("returns error message if API call throws", async () => {
    const error = new Error("API is down");
    __mockCreate__.mockRejectedValue(error);

    const response = await getTapeyResponse("Are you there?");
    expect(response).toEqual({
      message:
        "Sorry dude, I'm having some technical difficulties right now! Try again in a bit!",
      error: "API is down",
    });
  });

  it("returns generic error string if error is not an instance of Error", async () => {
    __mockCreate__.mockRejectedValue("weird string error");

    const response = await getTapeyResponse("This broke something");
    expect(response).toEqual({
      message:
        "Sorry dude, I'm having some technical difficulties right now! Try again in a bit!",
      error: "Unknown error",
    });
  });

  it("logs error to console", async () => {
    const error = new Error("Logging test");
    __mockCreate__.mockRejectedValue(error);

    await getTapeyResponse("test");
    expect(console.error).toHaveBeenCalledWith(
      "Error calling Claude API:",
      error,
    );
  });
});
